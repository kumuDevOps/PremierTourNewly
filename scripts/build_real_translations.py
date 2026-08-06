import json
import os
import time
import sys
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed

LANGUAGES = ['de', 'fr', 'ar', 'nl', 'ja', 'zh', 'ru', 'hi']

GT_LANG_MAP = {
    'zh': 'zh-CN',
    'de': 'de',
    'fr': 'fr',
    'ar': 'ar',
    'nl': 'nl',
    'ja': 'ja',
    'ru': 'ru',
    'hi': 'hi'
}

def clean_value(val, lang):
    if not val:
        return ""
    val_str = str(val).strip()
    bad_suffixes = [
        f"({lang.upper()})", "(DE)", "(FR)", "(NL)", "(RU)", "(AR)", "(HI)",
        "（日本語）", "（中文）", "(हिंदी)"
    ]
    for suf in bad_suffixes:
        if val_str.endswith(suf):
            val_str = val_str[:-len(suf)].strip()
    return val_str

def translate_batch(batch_texts, target_lang, max_retries=3):
    if not batch_texts:
        return []
    
    gt_code = GT_LANG_MAP.get(target_lang, target_lang)
    joined = '\n'.join(batch_texts)
    url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=' + gt_code + '&dt=t&q=' + urllib.parse.quote(joined)
    
    for attempt in range(max_retries):
        try:
            req = urllib.request.Request(url, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            })
            with urllib.request.urlopen(req, timeout=10) as response:
                res = json.loads(response.read().decode('utf-8'))
                translated_lines = []
                if res and res[0]:
                    full_text = ''.join([s[0] for s in res[0] if s and s[0]])
                    translated_lines = full_text.split('\n')
                
                if len(translated_lines) == len(batch_texts):
                    return [line.strip() for line in translated_lines]
                elif len(translated_lines) > 0:
                    # If split count differs slightly due to newlines inside translations
                    # return what we can or fall back
                    return [line.strip() for line in translated_lines[:len(batch_texts)]]
        except Exception as e:
            time.sleep(0.5 * (attempt + 1))
            
    # Fallback to single translate if batch fails
    results = []
    for text in batch_texts:
        results.append(translate_single(text, target_lang))
    return results

def translate_single(text, target_lang, max_retries=2):
    if not text or not text.strip():
        return text
    gt_code = GT_LANG_MAP.get(target_lang, target_lang)
    url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=' + gt_code + '&dt=t&q=' + urllib.parse.quote(text)
    for attempt in range(max_retries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=5) as resp:
                res = json.loads(resp.read().decode('utf-8'))
                return ''.join([s[0] for s in res[0] if s and s[0]]).strip()
        except Exception:
            time.sleep(0.3)
    return text

def process_language(lang, master_keys, existing_dict):
    print(f"Processing language: {lang}...", flush=True)
    result_dict = {}
    
    # 1. Preserve existing clean non-suffixed non-identical translations
    for k in master_keys:
        if k in existing_dict:
            cleaned = clean_value(existing_dict[k], lang)
            # If it's genuinely translated (not equal to key, or if equal to key but is a known invariant word)
            if cleaned and cleaned != k and not cleaned.endswith('(DE)') and not cleaned.endswith('(FR)') and not cleaned.endswith('(NL)'):
                result_dict[k] = cleaned

    keys_to_translate = [k for k in master_keys if k not in result_dict]
    print(f"[{lang}] {len(result_dict)} valid cached, {len(keys_to_translate)} keys to translate.", flush=True)

    # 2. Chunk into batches of 20
    chunk_size = 20
    chunks = [keys_to_translate[i:i + chunk_size] for i in range(0, len(keys_to_translate), chunk_size)]
    
    def batch_worker(chunk):
        res = translate_batch(chunk, lang)
        out = []
        for i, k in enumerate(chunk):
            translated_val = res[i] if i < len(res) and res[i] else k
            out.append((k, clean_value(translated_val, lang)))
        return out

    completed_chunks = 0
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = [executor.submit(batch_worker, chunk) for chunk in chunks]
        for future in as_completed(futures):
            pairs = future.result()
            for k, v in pairs:
                result_dict[k] = v
            completed_chunks += 1
            if completed_chunks % 10 == 0 or completed_chunks == len(chunks):
                print(f"[{lang}] Batches completed: {completed_chunks}/{len(chunks)}", flush=True)

    sorted_dict = {k: result_dict.get(k, k) for k in sorted(master_keys)}
    return sorted_dict

def main():
    with open('master_keys.json', 'r', encoding='utf-8') as f:
        master_keys = json.load(f)

    print(f"Loaded {len(master_keys)} master keys.", flush=True)

    # Clean en.json
    en_dict = {k: k for k in sorted(master_keys)}
    with open('src/locales/en.json', 'w', encoding='utf-8') as f:
        json.dump(en_dict, f, ensure_ascii=False, indent=2)
    with open('public/locales/en.json', 'w', encoding='utf-8') as f:
        json.dump(en_dict, f, ensure_ascii=False, indent=2)

    for lang in LANGUAGES:
        src_path = f'src/locales/{lang}.json'
        existing = {}
        if os.path.exists(src_path):
            try:
                with open(src_path, 'r', encoding='utf-8') as f:
                    existing = json.load(f)
            except Exception:
                existing = {}

        lang_dict = process_language(lang, master_keys, existing)

        # Save to both src/locales/ and public/locales/
        with open(f'src/locales/{lang}.json', 'w', encoding='utf-8') as f:
            json.dump(lang_dict, f, ensure_ascii=False, indent=2)

        with open(f'public/locales/{lang}.json', 'w', encoding='utf-8') as f:
            json.dump(lang_dict, f, ensure_ascii=False, indent=2)

        print(f"Successfully saved {lang}.json ({len(lang_dict)} keys)", flush=True)

    print("ALL LANGUAGES PROCESSED SUCCESSFULLY!", flush=True)

if __name__ == '__main__':
    main()
