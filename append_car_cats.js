const fs = require('fs');
const path = require('path');

const arPath = path.join(__dirname, 'src/locales/ar.json');
const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));
Object.assign(arData, {
  "Luxury Sports Car": "سيارة رياضية فاخرة",
  "Prestige SUV": "سيارة دفع رباعي فخمة",
  "Luxury Sedan": "سيدان فاخرة",
  "Convertible Coupe": "كوبيه مكشوفة",
  "Premium Electric": "سيارة كهربائية ممتازة",
  "Select Car Category": "اختر فئة السيارة"
});
fs.writeFileSync(arPath, JSON.stringify(arData, null, 2));

const enPath = path.join(__dirname, 'src/locales/en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
Object.assign(enData, {
  "Luxury Sports Car": "Luxury Sports Car",
  "Prestige SUV": "Prestige SUV",
  "Luxury Sedan": "Luxury Sedan",
  "Convertible Coupe": "Convertible Coupe",
  "Premium Electric": "Premium Electric",
  "Select Car Category": "Select Car Category"
});
fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));

console.log('car cats appended successfully.');
