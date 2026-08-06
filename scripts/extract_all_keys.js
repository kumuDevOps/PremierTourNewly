const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else if (name.endsWith('.tsx') || name.endsWith('.ts')) {
      files.push(name);
    }
  }
  return files;
}

const files = getFiles('src');
const translateKeys = new Set();
const unwrappedStrings = new Set();

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');

  // Match translate('...') or translate("...") or translate(`...`)
  const matches1 = content.matchAll(/translate\(\s*['"`]([^'"`]+)['"`]\s*\)/g);
  for (const m of matches1) {
    if (m[1]) translateKeys.add(m[1].trim());
  }

  // Also match unwrapped JSX text like >Some English Text<
  const matches2 = content.matchAll(/>\s*([A-Za-z][A-Za-z0-9\s\,\.\!\?\'\&\-\:\/\(\)\#\+]{2,})\s*</g);
  for (const m of matches2) {
    const str = m[1].trim();
    if (
      str &&
      !str.startsWith('translate') &&
      !str.startsWith('{') &&
      !str.startsWith('http') &&
      !str.startsWith('console.') &&
      !str.startsWith('import ') &&
      !str.startsWith('export ') &&
      !str.includes('className') &&
      !str.includes('onClick') &&
      str.length > 2
    ) {
      unwrappedStrings.add(str);
    }
  }
}

console.log('Total keys in translate():', translateKeys.size);
console.log('Total unwrapped JSX strings found:', unwrappedStrings.size);

// Combine all keys
const enJsonPath = path.join(__dirname, '../src/locales/en.json');
let enJsonKeys = [];
if (fs.existsSync(enJsonPath)) {
  enJsonKeys = Object.keys(JSON.parse(fs.readFileSync(enJsonPath, 'utf8')));
}

const masterKeys = Array.from(new Set([...translateKeys, ...unwrappedStrings, ...enJsonKeys])).filter(Boolean);
console.log('Total master keys to translate across all languages:', masterKeys.length);

fs.writeFileSync('master_keys.json', JSON.stringify(masterKeys, null, 2));
