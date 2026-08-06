const fs = require('fs');
let text = fs.readFileSync('src/components/CustomerDashboardView.tsx', 'utf8');
text = text.replace(/\{userProfile\.role\.replace\('_', ' '\)\}/g, "{translate(userProfile.role)}");
fs.writeFileSync('src/components/CustomerDashboardView.tsx', text);
