const { ExtraLifeDonationWatcher } = require('../dist');

const watcher = new ExtraLifeDonationWatcher({ participantId: '532356' });

watcher.on('started', () => {
  console.log('watching for donations');
});

watcher.on('participant-donation', (donation) => {
  console.log(JSON.stringify(donation));
});

watcher.start();
