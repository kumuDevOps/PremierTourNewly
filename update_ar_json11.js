const fs = require('fs');
const path = require('path');

const arPath = path.join(__dirname, 'src/locales/ar.json');
const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));

Object.assign(arData, {
  "e.g. Maldives, Istanbul, Santorini": "مثال: جزر المالديف، اسطنبول، سانتوريني",
  "e.g. London LHR, Dubai DXB": "مثال: لندن LHR، دبي DXB",
  "Departure": "المغادرة",
  "Return": "العودة"
});

fs.writeFileSync(arPath, JSON.stringify(arData, null, 2));
console.log('ar.json updated successfully.');
