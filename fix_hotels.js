const fs = require('fs');
let text = fs.readFileSync('src/components/HotelsView.tsx', 'utf8');
text = text.replace(/\{selectedHotel\.starRating \|\| 5\}-Star Luxury/g, "{selectedHotel.starRating || 5} {translate('Star Luxury')}");
fs.writeFileSync('src/components/HotelsView.tsx', text);
