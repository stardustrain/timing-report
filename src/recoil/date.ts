import { atom, selector } from 'recoil'
import { cond, equals, always } from 'ramda'

import { TODAY, GITHUB_QUERY_DATE_FORMAT, getWeekRange, getMonthRange } from '../utils/date'

// export type DateFilter = 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR'
export enum DateFilter {
  TODAY = 'TODAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export const dateFilter = atom<DateFilter>({
  key: 'dateFilter',
  default: DateFilter.TODAY,
})

export const dateSelector = selector({
  key: 'dateSelector',
  get: ({ get }) => {
    const filterOption = get(dateFilter)

    const res: { startAt: string; endAt: string } = cond([
      [
        equals(DateFilter.TODAY),
        always({
          startAt: TODAY.format(GITHUB_QUERY_DATE_FORMAT),
          endAt: TODAY.format(GITHUB_QUERY_DATE_FORMAT),
        }),
      ],
      [equals('WEEK'), () => getWeekRange()],
      [equals('MONTH'), () => getMonthRange()],
      [equals('YEAR'), () => {}],
    ])(filterOption)

    return res
  },
})
