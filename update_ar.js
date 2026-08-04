const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'src/locales/ar.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const translations = {
  "Adult": "بالغ",
  "Adults": "بالغين",
  "Child": "طفل",
  "Children": "أطفال",
  "Room": "غرفة",
  "Rooms": "غرف",
  "Economy": "سعر اقتصادي",
  "Premium Economy": "اقتصادي مميز",
  "Business": "رجال الأعمال",
  "First Class": "الدرجة الأولى"
};

for (const [k, v] of Object.entries(translations)) {
  data[k] = v;
}

fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log('Updated ar.json');
