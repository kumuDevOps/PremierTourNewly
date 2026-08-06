const fs = require('fs');

function fix(file) {
  let text = fs.readFileSync(file, 'utf8');
  text = text.replace(/<div className="mb-6">\s*\{\/\*\s*Visual Progress Bar Component\s*\*\/\}\s*<div className="mb-8">/g, '<div className="mb-8">');
  text = text.replace(/<\/div>\s*<\/div>\s*\{\/\* Main 2-Column Content Grid \*\/\}/g, '</div>\n\n            {/* Main 2-Column Content Grid */}');
  text = text.replace(/<\/div>\s*<\/div>\s*\{\/\* Controls, Quick Filters/g, '</div>\n\n            {/* Controls, Quick Filters');
  fs.writeFileSync(file, text);
}

fix('src/components/HotelsView.tsx');
