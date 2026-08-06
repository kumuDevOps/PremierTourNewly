const fs = require('fs');
const path = require('path');
const glob = require('glob');

const i18nFile = 'src/lib/i18n.tsx';
let i18nContent = fs.readFileSync(i18nFile, 'utf8');

// Find all translate('...') calls in all files
const files = glob.sync('src/**/*.tsx');
const allKeys = new Set();
const translateRegex = /translate\(\s*['"](.*?)['"]\s*\)/g;
const tRegex = /t\.([a-zA-Z0-9_]+)/g;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = translateRegex.exec(content)) !== null) {
    allKeys.add(match[1]);
  }
});

// Since the user is complaining about language errors, maybe I should just use Google Translate API? No, I will just add the missing keys using a simple dictionary or at least english fallbacks if they are completely missing.
// Wait! Let's check which keys are missing in which language.
console.log('Total keys used with translate():', allKeys.size);

