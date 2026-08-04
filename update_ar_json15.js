const fs = require('fs');
const path = require('path');

const arPath = path.join(__dirname, 'src/locales/ar.json');
const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));

Object.assign(arData, {
  "blog": "المدونة",
  "Blog": "المدونة",
  "Destinations": "الوجهات",
  "Travel Tips": "نصائح السفر",
  "Guides": "الأدلة"
});

fs.writeFileSync(arPath, JSON.stringify(arData, null, 2));
console.log('ar.json updated successfully.');
