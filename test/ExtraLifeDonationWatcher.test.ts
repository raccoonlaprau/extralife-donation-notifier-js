import { ExtraLifeDonation, ExtraLifeDonationWatcher } from '../src/ExtraLifeDonationWatcher';

jest.mock('extra-life', () => ({
  getParticipantDonations: jest.fn(),
  getTeamDonations: jest.fn(),
}));

const extraLife = require('extra-life');
let donation: ExtraLifeDonation;

describe('ExtraLifeDonationWatcher', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    Date.now = jest.fn(() => 1);
  });

  beforeEach(() => {
    extraLife.getParticipantDonations.mockRestore();
    extraLife.getTeamDonations.mockRestore();

    donation = {
      amount: 5,
      avatarImageURL: 'url',
      createdDateUTC: new Date(2020, 3, 2).toUTCString(),
      donationID: 'donation id',
      eventID: 12345,
      links: {
        recipient: 'recipient',
      },
      participantID: 12345,
      recipientName: 'name',
    };
  });

  jest.useFakeTimers();

  it('Emits a start event when started', () => {
    const watcher = new ExtraLifeDonationWatcher({});
    const spy = jest.fn();
    watcher.on('started', () => {
      spy();
    });
    expect(spy).toHaveBeenCalledTimes(0);

    watcher.start();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Emits a ping event when the timer ticks', () => {
    const watcher = new ExtraLifeDonationWatcher({});
    const spy = jest.fn();
    watcher.on('ping', () => {
      spy();
    });
    watcher.start();

    expect(spy).toHaveBeenCalledTimes(0);
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Requests participant donations when configured', (done) => {
    const watcher = new ExtraLifeDonationWatcher({ participantId: '12345' });
    watcher.start();

    extraLife.getParticipantDonations.mockImplementation(() => {
      expect(extraLife.getParticipantDonations).toHaveBeenCalledTimes(1);
      expect(extraLife.getParticipantDonations).toHaveBeenCalledWith('12345', 10);
      done();
    });

    expect(extraLife.getParticipantDonations).toHaveBeenCalledTimes(0);
    jest.runAllTimers();
  });

  it('Requests team donations when configured', (done) => {
    const watcher = new ExtraLifeDonationWatcher({ teamId: '12345' });
    watcher.start();

    extraLife.getTeamDonations.mockImplementation(() => {
      expect(extraLife.getTeamDonations).toHaveBeenCalledTimes(1);
      expect(extraLife.getTeamDonations).toHaveBeenCalledWith('12345', 10);
      done();
    });

    expect(extraLife.getTeamDonations).toHaveBeenCalledTimes(0);
    jest.runAllTimers();
  });

  it('Emits a team donation when found', (done) => {
    const watcher = new ExtraLifeDonationWatcher({ teamId: '12345' });
    extraLife.getTeamDonations.mockResolvedValue({ records: [donation] });

    watcher.on('team-donation', (donation) => {
      expect(donation.recipientName).toEqual('name');
      done();
    });

    watcher.start();
    jest.runAllTimers();
  });

  it('Emits a participant donation when found', (done) => {
    const watcher = new ExtraLifeDonationWatcher({ participantId: '12345' });
    extraLife.getParticipantDonations.mockResolvedValue({ records: [donation] });

    watcher.on('participant-donation', (donation) => {
      expect(donation.recipientName).toEqual('name');
      done();
    });

    watcher.start();
    jest.runAllTimers();
  });

  it('Emits an error on failure', (done) => {
    const watcher = new ExtraLifeDonationWatcher({ participantId: '12345' });
    extraLife.getParticipantDonations.mockRejectedValue('error');

    watcher.on('error', (err) => {
      expect(err).toEqual('error');
      done();
    });

    watcher.start();
    jest.runAllTimers();
  });
});
