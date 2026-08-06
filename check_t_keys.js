const fs = require('fs');

const content = fs.readFileSync('src/lib/i18n.tsx', 'utf8');
const langs = ['en', 'fr', 'de', 'nl', 'hi', 'ar', 'ru', 'ja', 'zh'];

// Let's use a regex to extract each language block.
for (const lang of langs) {
  const regex = new RegExp(`^\\s*${lang}:\\s*\\{[\\s\\S]*?^\\s*\\},?$`, 'gm');
  const matches = content.match(regex);
  if (matches) {
    const block = matches.join('\n');
    console.log(`Lang ${lang} has holidaysDesc:`, block.includes('holidaysDesc'));
  } else {
    console.log(`Lang ${lang} block not found`);
  }
}
