const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  const selectors = [
    'div#root:nth-of-type(1) > div:nth-of-type(1) > main:nth-of-type(1) > div:nth-of-type(1) > section:nth-of-type(1) > div:nth-of-type(4) > span:nth-of-type(1)',
    'div#root:nth-of-type(1) > div:nth-of-type(1) > main:nth-of-type(1) > div:nth-of-type(1) > section:nth-of-type(1) > div:nth-of-type(4) > p:nth-of-type(1)',
    'div#root:nth-of-type(1) > div:nth-of-type(1) > main:nth-of-type(1) > div:nth-of-type(1) > section:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > button:nth-of-type(1)',
    'div#root:nth-of-type(1) > div:nth-of-type(1) > main:nth-of-type(1) > div:nth-of-type(1) > section:nth-of-type(5) > div:nth-of-type(1) > div:nth-of-type(1) > p:nth-of-type(1)',
    'div#root:nth-of-type(1) > div:nth-of-type(1) > main:nth-of-type(1) > div:nth-of-type(1) > section:nth-of-type(5) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1)',
    'div#root:nth-of-type(1) > div:nth-of-type(1) > main:nth-of-type(1) > div:nth-of-type(1) > section:nth-of-type(7) > div:nth-of-type(3) > div:nth-of-type(3) > div:nth-of-type(6) > div:nth-of-type(2) > p:nth-of-type(1)',
    'div#root:nth-of-type(1) > div:nth-of-type(1) > main:nth-of-type(1) > div:nth-of-type(1) > section:nth-of-type(7) > div:nth-of-type(3) > div:nth-of-type(3) > div:nth-of-type(7) > div:nth-of-type(2) > p:nth-of-type(1)'
  ];

  for (const s of selectors) {
    try {
      const info = await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        return { tag: el.tagName, text: el.textContent, className: el.className };
      }, s);
      console.log(s, '=>', info);
    } catch(e) {
      console.log(s, '=> ERROR');
    }
  }
  await browser.close();
})();
