const fs = require('fs');
const path = './src/locales/ar.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const fixes = {
  "HOTEL BOOKING PROCESS": "عملية حجز الفندق",
  "FLIGHT BOOKING PROCESS": "عملية حجز الرحلة",
  "CAR BOOKING PROCESS": "عملية حجز السيارة",
  "TOUR BOOKING PROCESS": "عملية حجز الجولة",
};

for (const key in fixes) {
  data[key] = fixes[key];
}

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Fixed caps translations');
