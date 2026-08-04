const fs = require('fs');
const path = require('path');

const arPath = path.join(__dirname, 'src/locales/ar.json');
const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));

Object.assign(arData, {
  "All Reviews": "كل التقييمات",
  "With Photos": "مع الصور",
  "Honeymoon & Couples": "شهر العسل والأزواج",
  "Family Trips": "رحلات عائلية",
  "Solo & Wellness": "سفر فردي وصحي"
});

fs.writeFileSync(arPath, JSON.stringify(arData, null, 2));
console.log('ar.json updated successfully.');
