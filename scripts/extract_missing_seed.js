const fs = require("fs");
const path = require("path");

const seedPath = path.join(__dirname, "../src/db/seed_data.json");
const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));

const stringsToExtract = new Set();

seed.hotels.forEach(h => {
  stringsToExtract.add(h.name);
  if (h.description) stringsToExtract.add(h.description);
  if (h.amenities) h.amenities.forEach(a => stringsToExtract.add(a));
});

seed.tours.forEach(t => {
  stringsToExtract.add(t.name);
  if (t.description) stringsToExtract.add(t.description);
});

seed.flights.forEach(f => {
  stringsToExtract.add(f.airline);
  stringsToExtract.add(f.departureCity);
  stringsToExtract.add(f.arrivalCity);
});

seed.cars.forEach(c => {
  stringsToExtract.add(c.name);
  if (c.description) stringsToExtract.add(c.description);
  if (c.features) c.features.forEach(a => stringsToExtract.add(a));
});

console.log("Extracted strings:", Array.from(stringsToExtract).length);

const locales = ["en", "de", "fr", "nl", "ja", "zh", "ru", "hi", "ar"];

const missingInZh = [];
const zhPath = path.join(__dirname, "../src/locales/zh.json");
const zhJson = JSON.parse(fs.readFileSync(zhPath, "utf8"));
Array.from(stringsToExtract).forEach(s => {
  if (!zhJson[s]) missingInZh.push(s);
});

console.log("Missing in ZH:", missingInZh);
