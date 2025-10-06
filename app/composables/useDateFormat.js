import { useDateFormat, useTimeAgoIntl } from '@vueuse/core'

export default function (dateString, options={}) {
  const date = new Date(dateString)
  if (date) {
    if (options.ago || (options.agoMaxDays && new Date() - date < 1000*60*60*24*options.agoMaxDays)) {
      return useTimeAgoIntl(date, { locale: 'nl' }).value
    } else {
      const format = options.format || 'D MMMM YYYY, H:mm'
      return useDateFormat(date, format, { locales: 'nl' }).value
    }
  }
}
