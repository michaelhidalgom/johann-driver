import type enMessages from '@/messages/en.json'

export type Dictionary = typeof enMessages

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import('@/messages/en.json').then(m => m.default),
  es: () => import('@/messages/es.json').then(m => m.default),
}

export async function getDictionary(lang: string): Promise<Dictionary> {
  return (dictionaries[lang] ?? dictionaries.en)()
}
