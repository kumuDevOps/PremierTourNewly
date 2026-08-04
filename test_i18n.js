const fs = require('fs');

const arJSON = JSON.parse(fs.readFileSync('src/locales/ar.json', 'utf8'));

const language = 'ar';
const currentLoc = arJSON;

const translate = (key) => {
    if (!key) return '';
    const trimmed = key.trim();
    if (!trimmed) return '';

    // Direct exact lookup
    const lookupDirect = (str) => {
      if (currentLoc[str] && currentLoc[str] !== str) return currentLoc[str];
      return null;
    };
    
    const directVal = lookupDirect(trimmed);
    if (directVal) return directVal;

    const lowerKey = trimmed.toLowerCase();
    for (const dict of [currentLoc]) {
      if (!dict) continue;
      for (const k of Object.keys(dict)) {
        if (k.toLowerCase() === lowerKey && dict[k]) {
          if (dict[k] !== trimmed && dict[k] !== k) return dict[k];
        }
      }
    }
    
    return trimmed;
};

console.log("100% ->", translate("100% Real Guest Experiences"));
console.log("Loved ->", translate("Loved by Travelers Worldwide"));
console.log("Trustpilot ->", translate("Trustpilot"));
