const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./src/locales/ar.json', 'utf8'));
const texts = [
  'Select Hotel',
  'Guest Info',
  'Review & Pay',
  'Booking Voucher'
];
texts.forEach(t => {
  if (!data[t]) console.log('Missing:', t);
});
