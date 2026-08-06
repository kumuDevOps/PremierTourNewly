const fs = require('fs');
const path = './src/locales/ar.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

data["Light Mode"] = "الوضع الفاتح";
data["Dark Mode"] = "الوضع الداكن";
data["Switch to Light Mode"] = "التبديل إلى الوضع الفاتح";
data["Switch to Dark Mode"] = "التبديل إلى الوضع الداكن";

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Added Dark/Light Mode translations');
