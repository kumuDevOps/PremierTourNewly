const fs = require('fs');
const path = require('path');

const arPath = path.join(__dirname, 'src/locales/ar.json');
const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));

Object.assign(arData, {
  "May 2026": "مايو 2026",
  "June 2026": "يونيو 2026",
  "July 2026": "يوليو 2026",
  "August 2026": "أغسطس 2026",
  "September 2026": "سبتمبر 2026"
});

fs.writeFileSync(arPath, JSON.stringify(arData, null, 2));
console.log('ar.json dates appended successfully.');
