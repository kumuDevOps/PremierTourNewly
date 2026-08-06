const data = require('./src/locales/hi.json');
for(const [k, v] of Object.entries(data)) {
  if (k !== v && v.match(/[a-zA-Z]/) && !v.match(/USD|LKR|Premier|Google|Visa|MasterCard|PayHere|API|Arugam|Nuwara|Colombo|Galle|Sigiriya|Kandy|Ella|Mirissa|Bentota|Yala|Trincomalee|Polonnaruwa|Anuradhapura/)) {
     console.log(k, "=>", v);
  }
}
