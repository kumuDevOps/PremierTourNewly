const fs = require('fs');

const key = "For exclusive deals, tailored holiday packages, and the best of the Premier Tour Booking portfolio, add your email below.";
const hiFile = 'src/locales/hi.json';
const data = JSON.parse(fs.readFileSync(hiFile, 'utf8'));

console.log("Old value:", data[key]);
data[key] = "विशेष ऑफ़र, अनुकूलित अवकाश पैकेज और प्रीमियर टूर बुकिंग के बेहतरीन पोर्टफोलियो के लिए, नीचे अपना ईमेल जोड़ें।";
console.log("New value:", data[key]);

fs.writeFileSync(hiFile, JSON.stringify(data, null, 2));
