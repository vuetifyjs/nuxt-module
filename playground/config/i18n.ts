import type { LocaleObject } from '#i18n'

const multipleJson = process.env.MULTIPLE_LANG_FILES === 'true'

const countryLocaleVariants: Record<string, LocaleObject[]> = {
  en: [
    // en.json contains en-US translations
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
  ],
  es: [
    // es.json contains es-ES translations
    // { code: 'es-AR', name: 'Español (Argentina)' },
    // { code: 'es-BO', name: 'Español (Bolivia)' },
    // { code: 'es-CL', name: 'Español (Chile)' },
    // { code: 'es-CO', name: 'Español (Colombia)' },
    // { code: 'es-CR', name: 'Español (Costa Rica)' },
    // { code: 'es-DO', name: 'Español (República Dominicana)' },
    // { code: 'es-EC', name: 'Español (Ecuador)' },
    { code: 'es-ES', name: 'Español (España)' },
    // TODO: Support es-419, if we include spanish country variants remove also fix on utils/language.ts module
    { code: 'es-419', name: 'Español (Latinoamérica)' },
    // { code: 'es-GT', name: 'Español (Guatemala)' },
    // { code: 'es-HN', name: 'Español (Honduras)' },
    // { code: 'es-MX', name: 'Español (México)' },
    // { code: 'es-NI', name: 'Español (Nicaragua)' },
    // { code: 'es-PA', name: 'Español (Panamá)' },
    // { code: 'es-PE', name: 'Español (Perú)' },
    // { code: 'es-PR', name: 'Español (Puerto Rico)' },
    // { code: 'es-SV', name: 'Español (El Salvador)' },
    // { code: 'es-US', name: 'Español (Estados Unidos)' },
    // { code: 'es-UY', name: 'Español (Uruguay)' },
    // { code: 'es-VE', name: 'Español (Venezuela)' },
  ],
}

const locales: LocaleObject[] = [
  {
    code: 'en',
    file: 'en.json',
    name: 'English',
  },
  {
    code: 'es',
    file: 'es.json',
    name: 'Español',
  },
]

function buildLocales() {
  const useLocales = Object.values(locales).reduce((acc, data) => {
    const locales = countryLocaleVariants[data.code]
    if (locales) {
      locales.forEach((l) => {
        let entry: LocaleObject
        if (multipleJson) {
          entry = {
            ...data,
            code: l.code,
            name: l.name,
            files: [data.file!, `${l.code}.json`],
          }
          delete entry.file
        }
        else {
          entry = {
            ...data,
            code: l.code,
            name: l.name,
            file: `${l.code}.json`,
          }
        }

        acc.push(entry)
      })
    }
    else {
      acc.push(data)
    }

    return acc
  }, <LocaleObject[]>[])

  return useLocales.sort((a, b) => a.code.localeCompare(b.code))
}

export const availableLocales = buildLocales()

export const langDir = multipleJson ? 'locales/multiple' : 'locales/single'
