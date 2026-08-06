const fs = require('fs');
const glob = require('glob');
const path = require('path');

const hiData = JSON.parse(fs.readFileSync('./src/locales/hi.json', 'utf8'));
const files = glob.sync('./src/**/*.tsx');
const translateRegex = /translate\(\s*['"](.*?)['"]\s*\)/g;
const missing = new Set();

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = translateRegex.exec(content)) !== null) {
    const key = match[1];
    if (!hiData[key]) {
      missing.add(key);
    }
  }
});

console.log('Missing Hindi translations:');
Array.from(missing).forEach(k => console.log(k));
