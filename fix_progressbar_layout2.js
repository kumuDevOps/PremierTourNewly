const fs = require('fs');

function fixLayoutTours(filePath) {
  let text = fs.readFileSync(filePath, 'utf8');
  
  const pbRegex = /\{\/\*\s*Visual Progress Bar Component\s*\*\/\}\s*<BookingProgressBar[\s\S]*?\/>\s*/;
  const match = text.match(pbRegex);
  if (!match) return;
  
  const pbCode = match[0].trim();
  text = text.replace(pbRegex, '');
  
  // For Detail View:
  const detailHeroEnd = /<\/div>\s*\{\/\* Main 2-Column Content Grid \*\/\}/;
  if (detailHeroEnd.test(text)) {
    text = text.replace(detailHeroEnd, `</div>\n\n            <div className="mb-6">\n              ${pbCode.replace(/\\n/g, '\n              ')}\n            </div>\n\n            {/* Main 2-Column Content Grid */}`);
  }
  fs.writeFileSync(filePath, text);
  console.log('Fixed layout for', filePath);
}

function fixLayoutFlights(filePath) {
  let text = fs.readFileSync(filePath, 'utf8');
  
  const pbRegex = /\{\/\*\s*Visual Progress Bar Component\s*\*\/\}\s*<BookingProgressBar[\s\S]*?\/>\s*/;
  const match = text.match(pbRegex);
  if (!match) return;
  
  const pbCode = match[0].trim();
  text = text.replace(pbRegex, '');
  
  const flightFallback = /<\/div>\s*\{\/\* Booking Form Section \*\/\}/;
  if (flightFallback.test(text)) {
      text = text.replace(flightFallback, `</div>\n\n            <div className="mb-6">\n              ${pbCode.replace(/\\n/g, '\n              ')}\n            </div>\n\n            {/* Booking Form Section */}`);
  } else {
      const bannerEndRegex = /<\/div>\s*\{\/\* Search & Filters Container \*\/\}/;
      if (bannerEndRegex.test(text)) {
          text = text.replace(bannerEndRegex, `</div>\n\n            <div className="mb-6">\n              ${pbCode.replace(/\\n/g, '\n              ')}\n            </div>\n\n            {/* Search & Filters Container */}`);
      }
  }

  // Also try for list view in flights if not matched above
  const listEnd = /<\/motion\.div>\s*\{\/\* Main Flight Search Area \*\/\}/;
  if (listEnd.test(text)) {
      text = text.replace(listEnd, `</motion.div>\n\n            <div className="mb-6">\n              ${pbCode.replace(/\\n/g, '\n              ')}\n            </div>\n\n            {/* Main Flight Search Area */}`);
  }

  fs.writeFileSync(filePath, text);
  console.log('Fixed layout for', filePath);
}

fixLayoutTours('src/components/ToursView.tsx');
fixLayoutFlights('src/components/FlightsView.tsx');
