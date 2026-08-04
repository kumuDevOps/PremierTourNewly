const fs = require('fs');
const path = require('path');

const arPath = path.join(__dirname, 'src/locales/ar.json');
const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));

Object.assign(arData, {
  "3 Days": "3 أيام",
  "1 Week": "أسبوع 1",
  "2 Weeks": "أسبوعان",
  "Select Start Date": "تحديد تاريخ البدء",
  "Select End Date": "تحديد تاريخ الانتهاء",
  "Check In": "تسجيل الدخول",
  "Night": "ليلة",
  "Nights": "ليال",
  "Clear dates": "مسح التواريخ",
  "Done": "تم"
});

fs.writeFileSync(arPath, JSON.stringify(arData, null, 2));
console.log('ar.json updated successfully.');
