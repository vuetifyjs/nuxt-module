import type { DateTimeFormats, NumberFormats, PluralizationRules } from '@intlify/core-base'
import type { LocaleObject } from '#i18n'

const multipleJson = process.env.MULTIPLE_LANG_FILES === 'true'

const countryLocaleVariants: Record<string, LocaleObject[]> = {
  ar: [
    // ar.json contains ar-EG translations
    // { code: 'ar-DZ', name: 'Arabic (Algeria)' },
    // { code: 'ar-BH', name: 'Arabic (Bahrain)' },
    { code: 'ar-EG', name: 'العربية' },
    // { code: 'ar-EG', name: 'Arabic (Egypt)' },
    // { code: 'ar-IQ', name: 'Arabic (Iraq)' },
    // { code: 'ar-JO', name: 'Arabic (Jordan)' },
    // { code: 'ar-KW', name: 'Arabic (Kuwait)' },
    // { code: 'ar-LB', name: 'Arabic (Lebanon)' },
    // { code: 'ar-LY', name: 'Arabic (Libya)' },
    // { code: 'ar-MA', name: 'Arabic (Morocco)' },
    // { code: 'ar-OM', name: 'Arabic (Oman)' },
    // { code: 'ar-QA', name: 'Arabic (Qatar)' },
    // { code: 'ar-SA', name: 'Arabic (Saudi Arabia)' },
    // { code: 'ar-SY', name: 'Arabic (Syria)' },
    // { code: 'ar-TN', name: 'Arabic (Tunisia)' },
    // { code: 'ar-AE', name: 'Arabic (U.A.E.)' },
    // { code: 'ar-YE', name: 'Arabic (Yemen)' },
  ],
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
    code: 'ar',
    file: 'ar.json',
    name: 'العربية',
    dir: 'rtl',
    pluralRule: (choice: number) => {
      const name = new Intl.PluralRules('ar-EG').select(choice)
      return { zero: 0, one: 1, two: 2, few: 3, many: 4, other: 5 }[name]
    },
  },
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

export const datetimeFormats = Object.values(availableLocales).reduce((acc, data) => {
  const dateTimeFormats = data.dateTimeFormats
  if (dateTimeFormats) {
    acc[data.code] = { ...dateTimeFormats }
    delete data.dateTimeFormats
  }
  else {
    acc[data.code] = {
      shortDate: {
        dateStyle: 'short',
      },
      short: {
        dateStyle: 'short',
        timeStyle: 'short',
      },
      long: {
        dateStyle: 'long',
        timeStyle: 'medium',
      },
    }
  }

  return acc
}, <DateTimeFormats>{})

export const numberFormats = Object.values(availableLocales).reduce((acc, data) => {
  const numberFormats = data.numberFormats
  if (numberFormats) {
    acc[data.code] = { ...numberFormats }
    delete data.numberFormats
  }
  else {
    acc[data.code] = {
      percentage: {
        style: 'percent',
        maximumFractionDigits: 1,
      },
      smallCounting: {
        style: 'decimal',
        maximumFractionDigits: 0,
      },
      kiloCounting: {
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: 1,
      },
      millionCounting: {
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: 2,
      },
    }
  }

  return acc
}, <NumberFormats>{})

export const pluralRules = Object.values(availableLocales).reduce((acc, data) => {
  const pluralRule = data.pluralRule
  if (pluralRule) {
    acc[data.code] = pluralRule
    delete data.pluralRule
  }

  return acc
}, <PluralizationRules>{})

export const langDir = multipleJson ? 'locales/multiple' : 'locales/single'
