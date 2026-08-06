const fs = require('fs');
let text = fs.readFileSync('src/components/BookingProgressBar.tsx', 'utf8');

text = text.replace(
  /<span>\{translate\('Step'\)\} \{currentStep\} \{translate\('of'\)\} \{activeSteps\.length\}:<\/span>/g,
  '<span dir="auto">{translate(\'Step\')} <bdi>{currentStep}</bdi> {translate(\'of\')} <bdi>{activeSteps.length}</bdi>:</span>'
);

text = text.replace(
  /<span>\{Math\.round\(\(currentStep \/ activeSteps\.length\) \* 100\)\}% \{translate\('Completed'\)\}<\/span>/g,
  '<span dir="auto"><bdi>{Math.round((currentStep / activeSteps.length) * 100)}%</bdi> {translate(\'Completed\')}</span>'
);

fs.writeFileSync('src/components/BookingProgressBar.tsx', text);
console.log('Fixed BookingProgressBar.tsx');
