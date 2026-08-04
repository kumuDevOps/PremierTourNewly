const fs = require('fs');
const path = require('path');

const arPath = path.join(__dirname, 'src/locales/ar.json');
const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));

Object.assign(arData, {
  "Premier Tour Booking is a global travel provider offering customizable beach retreats, cultural explorations, modern flight packages, and premier car rentals since 2018. Over 120,000 travelers trust us to craft their dream itineraries.": "بريمير تور بوكينج هي شركة سفر عالمية تقدم ملاذات شاطئية مخصصة واستكشافات ثقافية وباقات طيران حديثة وتأجير سيارات فاخرة منذ عام 2018. أكثر من 120,000 مسافر يثقون بنا لتصميم رحلات أحلامهم."
});

fs.writeFileSync(arPath, JSON.stringify(arData, null, 2));
console.log('ar.json updated successfully.');
