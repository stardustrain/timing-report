import { getMonthRange } from '../date'
import dayjs from 'dayjs'

describe('date.js', () => {
  test('getMonthRange(targetDate: dayjs.Dayjs)', () => {
    expect(getMonthRange(dayjs('2020-04-16'))).toEqual({ startAt: '2020-04-01', endAt: '2020-04-30' })
    expect(getMonthRange(dayjs('2020-03-16'))).toEqual({ startAt: '2020-03-01', endAt: '2020-03-31' })
  })
})
