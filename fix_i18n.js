const fs = require('fs');
let file = 'src/lib/i18n.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/'Admin Panel'searchStaysTravel:/g, "'Admin Panel',\n      searchStaysTravel:");
fs.writeFileSync(file, content);
