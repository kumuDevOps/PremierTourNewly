const fs = require('fs');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  // Replace JSX text nodes: >Some text<  => >{translate("Some text")}<
  // Only if they start with an uppercase letter, contain letters, and don't contain { or }
  content = content.replace(/>([ \n\t]*)([A-Z][A-Za-z0-9 ,.!?'"&-]+?)([ \n\t]*)</g, (match, before, text, after) => {
    // skip if it looks like code
    if (text.includes("&&") || text.includes("||") || text.includes("=>")) return match;
    // skip if already translated
    if (text.includes("translate(")) return match;
    
    // Check if component has useLanguage
    return `>${before}{translate("${text}")}${after}<`;
  });

  // Replace placeholders
  content = content.replace(/placeholder="([A-Z][^"]+)"/g, (match, text) => {
    return `placeholder={translate("${text}")}`;
  });

  // Replace aria-labels
  content = content.replace(/aria-label="([A-Z][^"]+)"/g, (match, text) => {
    return `aria-label={translate("${text}")}`;
  });

  // Replace title attributes
  content = content.replace(/title="([A-Z][^"]+)"/g, (match, text) => {
    return `title={translate("${text}")}`;
  });

  if (content !== original) {
    // Ensure useLanguage is imported if used
    if (content.includes("translate(") && !content.includes("useLanguage")) {
      content = "import { useLanguage } from '../lib/i18n';\n" + content;
    }
    // Ensure translate is destructured
    if (content.includes("translate(") && !content.includes("const { translate }") && !content.includes("const { language, t, translate }")) {
      // Find where component starts
      content = content.replace(/(\w.*?:\s*React\.FC.*?=>\s*{)/, "$1\n  const { translate } = useLanguage();\n");
    }
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filePath}`);
  }
}

const dir = "src/components";
fs.readdirSync(dir).forEach(file => {
  if (file.endsWith(".tsx")) {
    processFile(`${dir}/${file}`);
  }
});
