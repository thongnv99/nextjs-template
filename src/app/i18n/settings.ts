import { InitOptions } from 'i18next'

export const fallbackLng = 'en'
export const languages = [fallbackLng, 'vi']

export const defaultNS = 'translation'

export function getOptions (lng = fallbackLng, ns = defaultNS): InitOptions {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns
  }
}