const fs = require('fs');
const path = require('path');

const arPath = path.join(__dirname, 'src/locales/ar.json');
const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));
Object.assign(arData, {
  "economy": "اقتصادية",
  "business": "أعمال",
  "first class": "درجة أولى"
});
fs.writeFileSync(arPath, JSON.stringify(arData, null, 2));

const enPath = path.join(__dirname, 'src/locales/en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
Object.assign(enData, {
  "economy": "Economy",
  "business": "Business",
  "first class": "First Class"
});
fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));

console.log('cabin classes appended successfully.');
