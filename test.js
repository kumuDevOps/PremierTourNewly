const fs = require('fs');
const arPath = './src/locales/ar.json';
const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));
arData["100% Real Guest Experiences"] = "تجارب ضيوف حقيقية 100%";
arData["Loved by Travelers Worldwide"] = "محبوب من قبل المسافرين حول العالم";
fs.writeFileSync(arPath, JSON.stringify(arData, null, 2));
console.log("Written!");
