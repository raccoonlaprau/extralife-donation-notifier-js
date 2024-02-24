import EventEmitter from 'eventemitter3';
import * as ExtraLife from 'extra-life';

export type ExtraLifeDonation = {
  participantID: number;
  amount: number;
  avatarImageURL: string;
  createdDateUTC: string;
  donationID: string;
  displayName?: string;
  message?: string;
  teamID?: number;
  donorID?: string;
  eventID: number;
  recipientName: string;
  links: {
    recipient: string;
  };
};

export type ExtraLifeDonationWatcherOptions = {
  participantId?: string;
  teamId?: string;
};

export interface IExtraLifeDonationWatcher {
  start(): void;
  stop(): void;
}

export interface IExtraLifeDonationWatcherEvents {
  'team-donation': (donation: ExtraLifeDonation) => void;
  'participant-donation': (donation: ExtraLifeDonation) => void;
  started: () => void;
  error: (e: any) => void;
}

export class ExtraLifeDonationWatcher extends EventEmitter<IExtraLifeDonationWatcherEvents> implements IExtraLifeDonationWatcher {
  private _participantId?: string;
  private _teamId?: string;
  private _donationCheckInterval?: NodeJS.Timeout;
  private _lastCheck: number;
  private _stopped: boolean;

  constructor(options: ExtraLifeDonationWatcherOptions) {
    super();

    this._participantId = options.participantId;
    this._teamId = options.teamId;
    this._lastCheck = Date.now();
    this._stopped = true;
  }

  /**
   * Begins listening on the configured participant and team IDs
   */
  public start(): void {
    if (!this._stopped) {
      return;
    }

    this._stopped = false;
    this._runCycle();
    this.emit('started');
  }

  /**
   * Stops the object from listening for more donations
   */
  public stop(): void {
    this._stopped = true;
    clearTimeout(this._donationCheckInterval);
  }

  /**
   * Private methods
   */

  private _runCycle() {
    this._donationCheckInterval = setTimeout(async () => {
      if (this._stopped) {
        return;
      }

      await this._processDonations();
      this._lastCheck = Date.now();
      this._runCycle();
    }, 5000);
  }

  private async _processDonations() {
    try {
      await this._emitRecentTeamDonations();
      await this._emitRecentParticipantDonations();
    } catch (e) {
      this.emit('error', e);
    }
  }

  private async _emitRecentTeamDonations() {
    if (!this._teamId) {
      return;
    }

    const donations: ExtraLifeDonation[] = (await ExtraLife.getTeamDonations(this._teamId, 10)).records;
    this._emitValidDonations(donations, 'team-donation');
  }

  private async _emitRecentParticipantDonations() {
    if (!this._participantId) {
      return;
    }

    const donations: ExtraLifeDonation[] = (await ExtraLife.getParticipantDonations(this._participantId, 10)).records;
    this._emitValidDonations(donations, 'participant-donation');
  }

  private _emitValidDonations(donations: ExtraLifeDonation[], type: keyof IExtraLifeDonationWatcherEvents) {
    donations
      .filter((donation) => {
        Date.parse(donation.createdDateUTC) > this._lastCheck;
      })
      .reverse()
      .forEach((donation) => {
        this.emit(type, donation);
      });
  }
}
