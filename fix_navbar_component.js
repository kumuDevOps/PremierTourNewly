const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
content = content.replace(/\{ label: 'Beach Holidays'/g, "{ label: translate('Beach Holidays')");
content = content.replace(/\{ label: 'City Tours'/g, "{ label: translate('City Tours')");
content = content.replace(/\{ label: 'Adventure Tours'/g, "{ label: translate('Adventure Tours')");
content = content.replace(/\{ label: 'Group Tours'/g, "{ label: translate('Group Tours')");
content = content.replace(/\{ label: 'Flights'/g, "{ label: translate('Flights')");
fs.writeFileSync('src/components/Navbar.tsx', content);
