import { InitOptions } from 'i18next'

export const fallbackLng = 'vi'
export const languages = [fallbackLng, 'ja']

export const defaultNS = 'translation'

export function getOptions(lng = fallbackLng, ns = defaultNS): InitOptions {
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