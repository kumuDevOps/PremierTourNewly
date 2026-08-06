const fs = require('fs');
let text = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
text = text.replace(/\{userProfile\.role\.replace\('_', ' '\)\}/g, "{translate(userProfile.role)}");
fs.writeFileSync('src/components/Navbar.tsx', text);
