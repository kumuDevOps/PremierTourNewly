const fs = require('fs');
const path = './src/locales/nl.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

for (const key in data) {
  if (typeof data[key] === 'string') {
    let val = data[key];
    val = val.replace(/ReBekijkening/gi, 'Beoordelen');
    val = val.replace(/ReBekijkened/gi, 'Beoordeeld');
    val = val.replace(/ReBekijkens/gi, 'Beoordelingen');
    val = val.replace(/ReBekijken/gi, 'Beoordeling');
    val = val.replace(/PreBekijken/gi, 'Voorbeeld');
    val = val.replace(/OverBekijken/gi, 'Overzicht');
    data[key] = val;
  }
}

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Fixed NL review issues');
