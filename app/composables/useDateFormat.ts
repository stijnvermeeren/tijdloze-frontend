import { useDateFormat, useTimeAgoIntl } from '@vueuse/core'

interface DateFormatOptions {
  ago?: boolean
  agoMaxDays?: number
  format?: string
}

export default function (dateString: string | number | Date | undefined, options: DateFormatOptions = {}): string | undefined {
  if (dateString === undefined) {
    return undefined
  }
  const date = new Date(dateString)
  if (!Number.isNaN(date.getTime())) {
    if (options.ago || (options.agoMaxDays && Date.now() - date.getTime() < 1000 * 60 * 60 * 24 * options.agoMaxDays)) {
      return useTimeAgoIntl(date, { locale: 'nl' }).value
    } else {
      const format = options.format || 'D MMMM YYYY, H:mm'
      return useDateFormat(date, format, { locales: 'nl' }).value
    }
  }
}
