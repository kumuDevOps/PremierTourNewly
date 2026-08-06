const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else if (name.endsWith('.tsx')) {
      files.push(name);
    }
  }
  return files;
}

const files = getFiles('src');
let totalUnwrapped = 0;
const allUnwrappedStrings = new Set();

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.match(/>\s*([A-Za-z][A-Za-z0-9\s\,\.\!\?\'\&\-\:\/]{3,})\s*</g);
  if (matches) {
    const unwrapped = matches
      .map(m => m.replace(/^>\s*/, '').replace(/\s*<$/, '').trim())
      .filter(t => 
        !t.startsWith('translate') && 
        !t.startsWith('{') && 
        !t.includes('className') &&
        !t.includes('onClick') &&
        !t.includes('http') &&
        !t.includes('console.') &&
        t.length > 3
      );
    if (unwrapped.length > 0) {
      console.log(`File: ${f} (${unwrapped.length} strings):`, unwrapped.slice(0, 5));
      unwrapped.forEach(s => allUnwrappedStrings.add(s));
      totalUnwrapped += unwrapped.length;
    }
  }
}

console.log('Total unwrapped JSX text matches across src:', totalUnwrapped);
console.log('Unique unwrapped strings:', allUnwrappedStrings.size);
fs.writeFileSync('unwrapped_strings.json', JSON.stringify(Array.from(allUnwrappedStrings), null, 2));
