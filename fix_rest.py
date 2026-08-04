import json
import os
import urllib.request
import urllib.parse
import time

def translate_single(text, target_language):
    try:
        url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=" + target_language + "&dt=t&q=" + urllib.parse.quote(text)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req)
        result = json.loads(response.read().decode('utf-8'))
        return "".join([x[0] for x in result[0]])
    except Exception as e:
        return text

locales_dir = 'src/locales'
locales = [f for f in os.listdir(locales_dir) if f.endswith('.json') and f != 'en.json']
lang_codes = {
    'ar.json': 'ar', 'fr.json': 'fr', 'de.json': 'de', 'hi.json': 'hi',
    'ja.json': 'ja', 'nl.json': 'nl', 'ru.json': 'ru', 'zh.json': 'zh-CN'
}

missing = [
    "Hotels", "Rentals", "Rooms", "Adult", "Adults", "Child", "Children", "Age 13+", "Guests & Rooms", "Guests", "Destination or hotel name"
]

for filename in locales:
    filepath = os.path.join(locales_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    target_lang = lang_codes.get(filename)
    if not target_lang: continue

    for m in missing:
        if m not in data or data[m] == m:
            data[m] = translate_single(m, target_lang)

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print("Rest JSON translations done")
