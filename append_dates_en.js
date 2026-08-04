const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src/locales/en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

Object.assign(enData, {
  "May 2026": "May 2026",
  "June 2026": "June 2026",
  "July 2026": "July 2026",
  "August 2026": "August 2026",
  "September 2026": "September 2026"
});

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
console.log('en.json dates appended successfully.');
