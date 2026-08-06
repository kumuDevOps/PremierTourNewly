const fs = require('fs');
const path = require('path');

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    // Check for hardcoded string placeholders: placeholder="Something" without translate
    if (line.includes('placeholder="') && !line.includes('translate(')) {
      console.log(`${filePath}:${idx+1} [placeholder] -> ${line.trim()}`);
    }
    // Check for hardcoded alt text: alt="Something" without translate
    if (line.includes('alt="') && !line.includes('translate(') && !line.includes('alt=""') && !line.includes('alt={')) {
      console.log(`${filePath}:${idx+1} [alt] -> ${line.trim()}`);
    }
    // Check for jsx tags with text directly inside >Text<
    const tagMatch = line.match(/>\s*([A-Za-z][A-Za-z0-9\s,\.\?\!\-\'\:\&]+)\s*</);
    if (tagMatch) {
      const txt = tagMatch[1].trim();
      if (txt.length > 2 && !txt.includes('translate') && !txt.includes('import') && !line.includes('//')) {
        console.log(`${filePath}:${idx+1} [jsx text] -> "${txt}" (line: ${line.trim()})`);
      }
    }
  });
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      if (f !== 'node_modules' && f !== 'dist') walkDir(p);
    } else if (p.endsWith('.tsx')) {
      checkFile(p);
    }
  });
}

walkDir('./src');
