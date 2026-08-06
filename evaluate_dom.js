const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { JSDOM } = require('jsdom');

// We can't easily require HomeView because it uses ES modules and imports Vite stuff.
