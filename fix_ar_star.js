const fs = require('fs');
const path = './src/locales/ar.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

data["Star Luxury"] = "نجوم الفخامة";

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Added Star Luxury');
