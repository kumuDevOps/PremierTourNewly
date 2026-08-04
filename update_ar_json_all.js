const fs = require('fs');
const path = require('path');

const arPath = path.join(__dirname, 'src/locales/ar.json');
const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));

Object.assign(arData, {
  "BLOG": "المدونة",
  "Blog": "المدونة",
  "Traveler": "مسافر",
  "2 Adults, Economy": "2 بالغين، السياحية",
  "TRAVEL DATES": "تواريخ السفر",
  "STRATEGIC PARTNERSHIPS": "شراكات استراتيجية",
  "Strategic Partnerships": "شراكات استراتيجية",
  "Going to": "الوجهة",
  "Flying from": "من",
  "Adults, Economy 2": "2 بالغين، السياحية",
  "2 Adults, 1 Room": "2 بالغين، غرفة واحدة",
  "Adults": "بالغين",
  "Child": "طفل",
  "Children": "أطفال",
  "Room": "غرفة",
  "Rooms": "غرف",
  "Economy": "اقتصادية",
  "Business": "أعمال",
  "First Class": "درجة أولى",
  "Travel Dates": "تواريخ السفر",
  "Adult": "بالغ",
  "N": "ل"
});

fs.writeFileSync(arPath, JSON.stringify(arData, null, 2));
console.log('ar.json updated successfully.');
