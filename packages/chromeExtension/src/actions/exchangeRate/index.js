
import { getExchangeRate, getYYYYMMDD } from './exchangeRate'
import { get, set, EXCHANGE_RATE_KEY } from '../summary/storage'

export const FETCH_EXCHANGE_RATE = 'FETCH_EXCHANGE_RATE'

export function createExchangeRateAction(exchangeRate) {
  return {
    type: FETCH_EXCHANGE_RATE,
    item: exchangeRate
  }
}

export function fetchExchangeRate() {
  return async (dispatch, getState) => {
    // console.log('fetchSummary async')

    try {
      // 1. storage를 먼저 본다.
      let exchangeRateList = get(EXCHANGE_RATE_KEY)
      console.log('fetchExchangeRate, exchangeRateList', exchangeRateList)

      let exchangeRate = getExchangeRateFromList(exchangeRateList)
      console.log('fetchExchangeRate, exchangeRate', exchangeRate)

      if (!exchangeRate.date || exchangeRate.usd === -1) {
        // default if empty
        exchangeRate = {
          date: new Date(2018, 4, 20), // 20 May 2018
          usd: 1080
        }
      }
      dispatch(createExchangeRateAction({
        updated: Date.now(),
        exchangeRate
      }))

      // 2. fetch할 필요가 있으면 가져와서 storage를 갱신한다.
      if ( needFetchExchangeRate(exchangeRate) ) {
        exchangeRate = await getExchangeRate()
        console.log('fetchExchangeRate', exchangeRate)

        const updatedExchangeRateList = add(exchangeRateList, exchangeRate)
        console.log('exchange rate list to update', updatedExchangeRateList)

        set(EXCHANGE_RATE_KEY, updatedExchangeRateList)

        if (exchangeRate.date && exchangeRate.usd !== -1) {
          dispatch(createExchangeRateAction({
            updated: Date.now(),
            exchangeRate
          }))
        }
      }
    } catch(error) {
      console.log(error)
    }
  }
}

/**
 * exchangeRateList.length <= 7 로 유지
 *
 * @param {*} exchangeRateList
 * @param {*} exchangeRate
 */
function add(exchangeRateList = [], exchangeRate) {
  const { date, usd } = exchangeRate

  const sameDateFound = exchangeRateList.some(({ date: itemDate, usd: itemUsd }) => itemDate === date)
  if (!sameDateFound) {
    exchangeRateList.push(exchangeRate)
    return exchangeRateList.slice(0, 7)
  }
  return exchangeRateList
}

/**
 * exchange rate를 구해 올 수 있는가?
 *
 *
 *
 * @param {*} date
 */
function needFetchExchangeRate(exchangeRate) {
  const { date, usd } = exchangeRate

  if (!date) return true

  const curDate = Date.now()
  // 1. date가 어제이전
  if (date < curDate) return true
  // 2. date가 오늘 && 11시 이후
  if (date.getDate() === curDate.getDate() && date.getMonth() === curDate.getMonth()) {
    // 이미 -1이면 오늘이 공휴일이기 때문에 가져올 필요가 없다.
    if ( usd === -1) return false

    // hour 0 ~,
    if (curDate.getHours() >= 10) return true
  }
  return false
}

/**
 * get usd exchange rate
 *
 * 가장 최근 날짜 & usd !== -1
 *
 * @param {Object} exchangeRateList [
 *   { date: '20180501', usd: 1081 },
 *   { date: '20180502', usd: 1082 },
 *   { date: '20180502', usd: 1083 }
 * ]
 * @return { date, usd }
 */
function getExchangeRateFromList(exchangeRateList = []) {
  const selection = exchangeRateList.reduce((prev, { date, usd }) => {
    if (date) {
      if (usd !== -1) {
        if (Number(date) > Number(prev.date)) {
          prev = { date, usd }
        }
      }
    } else {
      prev = { date, usd }
    }
    return prev
  }, {})
  return selection
}
