const fs = require('fs');
const path = require('path');

const arPath = path.join(__dirname, 'src/locales/ar.json');
const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));

Object.assign(arData, {
  "Traveler": "مسافر",
  "Adult": "بالغ",
  "Adults": "بالغين",
  "Child": "طفل",
  "Children": "أطفال",
  "Room": "غرفة",
  "Rooms": "غرف",
  "Economy": "السياحية",
  "Business": "الأعمال",
  "First Class": "الدرجة الأولى",
  "Guests": "ضيوف",
  "2 Adults, Economy": "2 بالغين، السياحية",
  "2 Adults, 1 Room": "2 بالغين، 1 غرفة",
  "Cinnamon Grand Colombo": "سينامون جراند كولومبو",
  "Colombo": "كولومبو",
  "COLOMBO, SRI LANKA": "كولومبو، سريلانكا",
  "LUXURY RESORT": "منتجع فاخر"
});

fs.writeFileSync(arPath, JSON.stringify(arData, null, 2));
console.log('ar.json updated successfully.');
