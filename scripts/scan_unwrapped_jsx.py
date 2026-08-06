import os
import re

components_dir = 'src/components'
files = [os.path.join(components_dir, f) for f in os.listdir(components_dir) if f.endswith('.tsx')]

unwrapped_by_file = {}

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if component imports useLanguage
    has_use_language = 'useLanguage' in content

    # Find unwrapped text strings inside JSX >Text<
    # Ignore tags like <script>, <style>, SVG paths, icon names, brackets, empty lines
    matches = re.findall(r'>\s*([A-Z][A-Za-z0-9\s\,\.\!\?\'\&\-\:\/\(\)\#\+]{2,})\s*<', content)
    valid_unwrapped = []
    for m in matches:
        text = m.strip()
        if (not text.startswith('{') and 
            not text.startswith('translate') and 
            not text.startswith('http') and
            not text.startswith('className') and
            not text.startswith('const ') and
            not text in ['SVG', 'HTML', 'CSS', 'JSON', 'API', 'USD', 'EUR', 'GBP', 'LKR', 'JPY', 'AUD', 'CAD'] and
            len(text) > 2):
            valid_unwrapped.append(text)

    if valid_unwrapped:
        unwrapped_by_file[os.path.basename(filepath)] = {
            'has_hook': has_use_language,
            'count': len(valid_unwrapped),
            'sample': valid_unwrapped[:5]
        }

print(f"Scanned {len(files)} components. Found {len(unwrapped_by_file)} files with potential unwrapped strings:")
for fname, info in unwrapped_by_file.items():
    print(f"- {fname} (has useLanguage: {info['has_hook']}): {info['count']} unwrapped strings. Sample: {info['sample']}")
