const fs = require('fs');

function fixLayout(filePath) {
  if (!fs.existsSync(filePath)) return;
  let text = fs.readFileSync(filePath, 'utf8');
  
  const pbRegex = /\{\/\*\s*Visual Progress Bar Component\s*\*\/\}\s*<div className="mb-8">\s*<BookingProgressBar[\s\S]*?<\/div>\s*/;
  const match = text.match(pbRegex);
  if (!match) return;
  
  const pbCode = match[0].trim();
  text = text.replace(pbRegex, '');
  
  // Now, where to put it?
  // Let's find the main conditional: `{selected(Hotel|Tour|Flight|Car) ? (`
  // Wait, the conditional name varies. Let's find: `) : (` which separates detail vs list.
  // Actually, we can just insert the progress bar at the very TOP of the Detail View content, 
  // and at the very TOP of the List View content!
  // BUT the user wants the Hero first. 
  // In Detail View: The Hero is `<div className="relative rounded-[32px] overflow-hidden text-white`
  // In List View: The Hero is `<motion.div \n              initial={{ opacity: 0, y: -20 }}\n              animate={{ opacity: 1, y: 0 }}\n              transition={{ type: "spring", stiffness: 70 }}\n              className="relative rounded-[32px] overflow-hidden text-white`
  
  // For Detail View:
  const detailHeroEnd = /<\/div>\s*\{\/\* Main 2-Column Content Grid \*\/\}/;
  if (detailHeroEnd.test(text)) {
    text = text.replace(detailHeroEnd, `</div>\n\n            <div className="mb-6">\n              ${pbCode.replace(/\\n/g, '\n              ')}\n            </div>\n\n            {/* Main 2-Column Content Grid */}`);
  } else {
    // For Cars or Flights where grid might be different
    const altDetailEnd = /<\/div>\s*\{\/\* (Left Column|Main Grid|Flight Segments) \*\/\}/;
    const m = text.match(altDetailEnd);
    if (m) {
        text = text.replace(m[0], `</div>\n\n            <div className="mb-6">\n              ${pbCode.replace(/\\n/g, '\n              ')}\n            </div>\n\n            {/* ${m[1]} */}`);
    } else {
       // fallback for flights detail
       const flightFallback = /<\/div>\s*\{\/\* Booking Form Section \*\/\}/;
       if (flightFallback.test(text)) {
           text = text.replace(flightFallback, `</div>\n\n            <div className="mb-6">\n              ${pbCode.replace(/\\n/g, '\n              ')}\n            </div>\n\n            {/* Booking Form Section */}`);
       }
    }
  }
  
  // For List View:
  const listHeroEnd = /<\/motion\.div>\s*\{\/\* Controls, Quick Filters/;
  if (listHeroEnd.test(text)) {
    text = text.replace(listHeroEnd, `</motion.div>\n\n            <div className="mb-6">\n              ${pbCode.replace(/\\n/g, '\n              ')}\n            </div>\n\n            {/* Controls, Quick Filters`);
  }

  fs.writeFileSync(filePath, text);
  console.log('Fixed layout for', filePath);
}

['src/components/HotelsView.tsx', 'src/components/ToursView.tsx', 'src/components/CarsView.tsx', 'src/components/FlightsView.tsx'].forEach(fixLayout);
