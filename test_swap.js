const fs = require('fs');

function swapProgressBar(filePath) {
  let text = fs.readFileSync(filePath, 'utf8');
  
  // Extract BookingProgressBar block
  const pbarRegex = /\{\/\* Visual Progress Bar Component \*\/\}\s*<div className="mb-8">\s*<BookingProgressBar[\s\S]*?<\/div>/;
  const match = text.match(pbarRegex);
  if (!match) return;
  const pbarCode = match[0];
  
  // Remove it from the original location
  text = text.replace(pbarRegex, '');
  
  // Now we need to insert it AFTER the Banner in the 'else' block,
  // and AFTER the Top Nav / Header Title in the 'if' block.
  
  // 1. Insert in 'else' block (Default List View)
  const bannerEndRegex = /\{\/\* Ambient Glows \*\/\}([\s\S]*?)<\/motion\.div>/;
  const elseMatch = text.match(bannerEndRegex);
  if (elseMatch) {
    text = text.replace(bannerEndRegex, elseMatch[0] + '\n\n            ' + pbarCode);
  }

  // 2. Insert in 'if' block (Detail View)
  const detailHeaderRegex = /\{\/\* Header Title Section with Anime Blue Glow \*\/\}([\s\S]*?)(?=\n\s*\{\/\* Main Grid Layout \*\/\}|\n\s*<div className="grid )/;
  const ifMatch = text.match(detailHeaderRegex);
  if (ifMatch) {
    text = text.replace(detailHeaderRegex, ifMatch[0] + '\n\n            ' + pbarCode);
  }
  
  fs.writeFileSync(filePath + '.test', text);
  console.log('Processed', filePath);
}

// swapProgressBar('src/components/HotelsView.tsx');
