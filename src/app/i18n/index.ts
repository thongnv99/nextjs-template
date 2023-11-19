import { ReactOptions, createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
import { getOptions } from './settings'
import { useParams } from 'next/navigation'

const initI18next = async (lng: string, ns: string) => {
    const i18nInstance = createInstance()
    await i18nInstance
        .use(initReactI18next)
        .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
        .init(getOptions(lng, ns))
    return i18nInstance
}

export async function useTranslation(ns?: string | string[], options: ReactOptions = {}) {
    const { lng } = useParams();
    const i18nextInstance = await initI18next(lng as string | undefined || 'vi', ns as string)
    return {
        t: i18nextInstance.getFixedT(lng || 'vi', Array.isArray(ns) ? ns[0] : ns, options.keyPrefix),
        i18n: i18nextInstance
    }
}