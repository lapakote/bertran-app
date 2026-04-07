/**
 * MyMemory — бесплатный перевод без API-ключа (до 1000 запросов/день).
 * https://mymemory.translated.net/doc/spec.php
 */
export async function translateRuToEn(text: string): Promise<string> {
  const params = new URLSearchParams({ q: text, langpair: 'ru|en' })
  const res = await fetch(`https://api.mymemory.translated.net/get?${params}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  const translated: string = json.responseData?.translatedText ?? ''
  if (!translated || translated.toUpperCase() === translated) {
    // MyMemory иногда возвращает ALL CAPS при ошибке — фильтруем
    throw new Error('Перевод недоступен')
  }
  return translated
}
