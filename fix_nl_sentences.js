const fs = require('fs');
const path = './src/locales/nl.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const fixes = {
  "Failed to post review.": "Plaatsen van beoordeling mislukt.",
  "Please write a review comment.": "Schrijf alstublieft een beoordeling.",
  "Post Review": "Beoordeling plaatsen",
  "Proceed to Review & Pay": "Ga naar Beoordeling & Betaling",
  "REVIEW COMMENTS": "BEOORDELINGEN",
  "Review & Pay": "Beoordelen & Betalen",
  "Review Comments": "Beoordelingen",
  "Reviewed on": "Beoordeeld op",
  "Reviewing Flight Details": "Vluchtgegevens beoordelen",
  "Write a Review": "Schrijf een beoordeling",
  "Your Review Comment": "Uw beoordeling",
  "Your review has been shared. Thank you for your feedback!": "Uw beoordeling is gedeeld. Bedankt voor uw feedback!",
  "Submit Verified Review": "Geverifieerde beoordeling indienen",
  "Submit Your Verified Rental Review": "Dien uw geverifieerde huurbeoordeling in",
  "Category Container Image Preview": "Voorbeeld categorie container afbeelding",
  "LIVE ROUTE & TRANSFER MAP PREVIEW": "LIVE ROUTE & TRANSFER KAART VOORBEELD",
  "PayPal Express Checkout Preview:": "PayPal Express Checkout Voorbeeld:"
};

for (const key in fixes) {
  if (data[key]) {
    data[key] = fixes[key];
  }
}

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Fixed mixed NL sentences');
