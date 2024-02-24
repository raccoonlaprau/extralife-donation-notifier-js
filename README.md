# Node.js Extra Life Donation Notifier

A library for watching your extralife pages for live events when a donation is made

## About

I mainly wrote this because it didn't seem like there was anything similar out there that could listen to the API in realtime.

This module is multi-platform and can be used in Node.js scripts or within the browser.
It requires a few libraries that should work across both platforms. It may require polyfils if your browser does not support fetch.

Donation object shapes from each event will match the [DonorDrive Public API spec](https://github.com/DonorDrive/PublicAPI).

## Installation

WIP

## Usage

Sample usage can be found in the samples folder.

There are 2 donation events that can be listened to, and 3 others for your own reference.

`started`: For when the watcher begins

`participant-donation`: For when someone donates to your particular participant campaign

`team-donation`: For when your team receives a donation

`ping`: This event is fired each time the APIs are queried

`error`: Fired when there is some kind of error in the APIs

### Node.js

```js
const { ExtraLifeDonationWatcher } = require('extra-life-donation-watcher');

const watcher = new ExtraLifeDonationWatcher({ participantId: '532356' });

watcher.on('started', () => {
  console.log('watching for donations');
});

watcher.on('participant-donation', (donation) => {
  console.log(JSON.stringify(donation));
});

watcher.start();
```

Remember to call `watcher.stop()` when finished! Otherwise the pings will continue in the background taking up memory.

### Browser

```html
<script src="../dist/extra-life-donation-watcher.min.js"></script>
<script>
  const watcher = new ExtraLifeDonationWatcher.ExtraLifeDonationWatcher({ participantId: '532356' });
  watcher.on('started', () => {
    console.log('started watching for donations');
  });

  watcher.on('participant-donation', (donation) => {
    console.log(JSON.stringify(donation));
  });

  watcher.start();
</script>
```

Remember to call `watcher.stop()` when finished! Otherwise the pings will continue in the background taking up memory.

---

## Remember to donate to help the children!

The extra life charity and the people who stream and run events for it are amazing people and do wonderful things for kids in need!

If you use this module and are feeling generous, [please remember to donate to this cause to help the kids in need.](https://www.extra-life.org/participant/laprau)
Every donation will directly benefit Children's Miracle Network Hospitals.
