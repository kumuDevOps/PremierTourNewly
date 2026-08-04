const fs = require('fs');
const path = require('path');

const arPath = path.join(__dirname, 'src/locales/ar.json');
const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));

Object.assign(arData, {
  "Car Class": "فئة السيارة",
  "Any Class": "أي فئة",
  "Luxury": "فاخرة",
  "SUV": "دفع رباعي",
  "Sports": "رياضية",
  "Going to": "الوجهة",
  "Flying from": "من"
});

fs.writeFileSync(arPath, JSON.stringify(arData, null, 2));
console.log('ar.json updated successfully.');
