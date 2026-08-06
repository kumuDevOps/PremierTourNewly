const fs = require('fs');
const glob = require('glob');
const path = require('path');

const arData = JSON.parse(fs.readFileSync('./src/locales/ar.json', 'utf8'));

const files = glob.sync('./src/**/*.tsx');
const translateRegex = /translate\(\s*['"](.*?)['"]\s*\)/g;
const missing = new Set();
const found = new Set();

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = translateRegex.exec(content)) !== null) {
    const key = match[1];
    if (!arData[key]) {
      missing.add(key);
    } else {
      found.add(key);
    }
  }
});

console.log('Missing translations:');
Array.from(missing).forEach(k => console.log(k));
