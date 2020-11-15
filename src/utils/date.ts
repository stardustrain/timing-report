import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import weekDay from 'dayjs/plugin/weekday'

dayjs.extend(utc)
dayjs.extend(weekDay)

export const GITHUB_QUERY_DATE_FORMAT = 'YYYY-MM-DD'

export const githubDateFormat = (date: string | Date | dayjs.Dayjs) => dayjs(date).format(GITHUB_QUERY_DATE_FORMAT)

export const getUtc = (date?: string | number | Date) => dayjs(date).utc()
export const TODAY = getUtc()

export const getWeekRange = (targetDate?: dayjs.Dayjs) => {
  const date = targetDate ?? dayjs()
  return {
    startAt: `${date.weekday(0).format(GITHUB_QUERY_DATE_FORMAT)}`,
    endAt: `${date.format(GITHUB_QUERY_DATE_FORMAT)}`,
  }
}

export const getMonthRange = (targetDate?: dayjs.Dayjs) => {
  const date = targetDate ?? dayjs()
  const firstDayOfMonth = date.set('date', 1)
  return {
    startAt: `${firstDayOfMonth.format(GITHUB_QUERY_DATE_FORMAT)}`,
    endAt: `${firstDayOfMonth
      .set('month', firstDayOfMonth.get('month') + 1)
      .subtract(1, 'day')
      .format(GITHUB_QUERY_DATE_FORMAT)}`,
  }
}

export const getDateRange = (startAt: string, endAt: string) => dayjs(endAt).diff(dayjs(startAt), 'day')
