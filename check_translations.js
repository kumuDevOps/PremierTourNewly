const fs = require('fs');
const glob = require('glob');

const hi = JSON.parse(fs.readFileSync('src/locales/hi.json', 'utf8'));
const files = glob.sync('src/**/*.{ts,tsx}');
const missing = new Set();
const untranslated = new Set(); // Exists in hi.json but value is English or mangled English

const regex = /translate\(\s*(['"`])(.*?)\1\s*\)/g;
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = regex.exec(content)) !== null) {
    const key = match[2];
    if (!hi[key]) {
      missing.add(key);
    } else {
      // Check if it's poorly translated
      if (hi[key] === key || hi[key].match(/[a-zA-Z]{5,}/)) {
        untranslated.add({key, value: hi[key]});
      }
    }
  }
}

console.log("Missing entirely:", Array.from(missing));
console.log("Untranslated/Mangled:", Array.from(untranslated));
