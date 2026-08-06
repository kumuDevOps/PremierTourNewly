const fs = require('fs');
const path = require('path');

const blogTranslations = {
  en: { Blog: 'Blog', BLOG: 'BLOG', blog: 'Blog' },
  de: { Blog: 'Reiseblog', BLOG: 'REISEBLOG', blog: 'Reiseblog' },
  fr: { Blog: 'Blog Voyage', BLOG: 'BLOG VOYAGE', blog: 'Blog Voyage' },
  nl: { Blog: 'Reisblog', BLOG: 'REISBLOG', blog: 'Reisblog' },
  ar: { Blog: 'المدونة', BLOG: 'المدونة', blog: 'المدونة' },
  ja: { Blog: 'ブログ', BLOG: 'ブログ', blog: 'ブログ' },
  zh: { Blog: '博客', BLOG: '博客', blog: '博客' },
  ru: { Blog: 'Блог', BLOG: 'БЛОГ', blog: 'Блог' },
  hi: { Blog: 'ब्लॉग', BLOG: 'ब्लॉग', blog: 'ब्लॉग' }
};

['src/locales', 'public/locales'].forEach(dir => {
  Object.keys(blogTranslations).forEach(lang => {
    const file = path.join(__dirname, `../${dir}/${lang}.json`);
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      Object.assign(data, blogTranslations[lang]);
      fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
      console.log(`Updated ${file}`);
    }
  });
});

console.log('Finished updating Blog translations across all JSON locale files!');
