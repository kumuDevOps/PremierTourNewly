const fs = require('fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('dist/index.html', 'utf8');

// Note: To use jsdom we need the app rendered, but since it's an SPA, index.html is empty!
// So we can't easily query selectors unless we render it or we map them to the TSX files.
