const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src/locales/en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

Object.assign(enData, {
  "BLOG": "BLOG",
  "Blog": "Blog",
  "Traveler": "Traveler",
  "VIP Traveler": "VIP Traveler",
  "2 Adults, Economy": "2 Adults, Economy",
  "TRAVEL DATES": "TRAVEL DATES",
  "STRATEGIC PARTNERSHIPS": "STRATEGIC PARTNERSHIPS",
  "Strategic Partnerships": "Strategic Partnerships",
  "Going to": "Going to",
  "Flying from": "Flying from",
  "Adults, Economy 2": "2 Adults, Economy",
  "2 Adults, 1 Room": "2 Adults, 1 Room",
  "Adults": "Adults",
  "Child": "Child",
  "Children": "Children",
  "Room": "Room",
  "Rooms": "Rooms",
  "Economy": "Economy",
  "Business": "Business",
  "First Class": "First Class",
  "Travel Dates": "Travel Dates",
  "Adult": "Adult",
  "N": "N"
});

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
console.log('en.json appended successfully.');
