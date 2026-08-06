const fs = require('fs');
const path = './src/locales/ar.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const fixes = {
  "admin": "مسؤول",
  "vip": "شخصية هامة",
  "standard": "قياسي",
  "Admin": "مسؤول",
  "VIP": "شخصية هامة",
  "Standard": "قياسي"
};

for (const key in fixes) {
  data[key] = fixes[key];
}

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Fixed roles translations');
