const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./src/locales/ar.json', 'utf8'));
const texts = [
  'Compare stays & rooms',
  'Dates & occupancy',
  'Instant confirmation',
  'Stay reserved',
  'Choose rental car',
  'Dates & location',
  'Insurance & deposit',
  'Voucher issued',
  'Choose itinerary',
  'Travelers & dates',
  'Payment details',
  'Pass & details ready',
  'Reservation Ready',
  'Explore Tours'
];
texts.forEach(t => {
  if (!data[t]) console.log('Missing:', t);
});
