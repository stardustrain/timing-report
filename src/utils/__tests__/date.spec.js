import MockDate from 'mockdate'
import { getMonthRange, getWeekRange, TODAY, date } from '../date'
import dayjs from 'dayjs'

describe('date.js', () => {
  test('getMonthRange(targetDate: dayjs.Dayjs)', () => {
    expect(getMonthRange(dayjs('2020-04-16'))).toBe('2020-04-01..2020-04-30')
    expect(getMonthRange(dayjs('2020-03-16'))).toBe('2020-03-01..2020-03-31')
  })
})
