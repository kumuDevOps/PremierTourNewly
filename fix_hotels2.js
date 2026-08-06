const fs = require('fs');
let text = fs.readFileSync('src/components/HotelsView.tsx', 'utf8');
text = text.replace(/\{t\.amenities\} offered/g, "{t.amenities}");
fs.writeFileSync('src/components/HotelsView.tsx', text);
