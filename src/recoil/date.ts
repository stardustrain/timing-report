import { atom, selector } from 'recoil'
import { cond, equals, always } from 'ramda'

import { TODAY, GITHUB_QUERY_DATE_FORMAT, getWeekRange, getMonthRange } from '../utils/date'

export enum DateFilterType {
  TODAY = 'TODAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
  CUSTOM = 'CUSTOM',
}

type DateFilter =
  | {
      filterType: Exclude<DateFilterType, DateFilterType.CUSTOM>
    }
  | {
      filterType: DateFilterType.CUSTOM
      range: {
        startAt: string
        endAt: string
      }
    }

export const dateFilter = atom<DateFilter>({
  key: 'dateFilter',
  default: {
    filterType: DateFilterType.TODAY,
  },
})

export const dateRangeSelector = selector({
  key: 'dateRangeSelector',
  get: ({ get }) => {
    const filterOption = get(dateFilter)

    if (filterOption.filterType === DateFilterType.CUSTOM) {
      return filterOption.range
    }

    const res = cond<any, any>([
      [
        equals(DateFilterType.TODAY),
        always({
          startAt: TODAY.format(GITHUB_QUERY_DATE_FORMAT),
          endAt: TODAY.format(GITHUB_QUERY_DATE_FORMAT),
        }),
      ],
      [equals(DateFilterType.WEEK), () => getWeekRange()],
      [equals(DateFilterType.MONTH), () => getMonthRange()],
    ])(filterOption.filterType)

    return res
  },
})
