
import request from 'request-promise'

/**
 *
 * ticker - not official upbit api
 *
 * e.g,
 * https://crix-api.upbit.com/v1/crix/trades/ticks?code=CRIX.UPBIT.KRW-STEEM&count=1
 *
 * [{
 *   "code":"CRIX.UPBIT.KRW-STEEM",
 *   "tradeDate":"2018-04-30",
 *   "tradeTime":"10:00:53",
 *   "tradeDateKst":"2018-04-30",
 *   "tradeTimeKst":"19:00:53",
 *   "tradeTimestamp":1525082453000,
 *   "tradePrice":4285.00000000,
 *   "tradeVolume":1.50530766,
 *   "prevClosingPrice":4575.00000000,
 *   "change":"FALL",
 *   "changePrice":290.00000000,
 *   "askBid":"ASK",
 *   "sequentialId":1525082453000002,
 *   "timestamp":1525082459629
 *  }]
 * @param {Array} currencies
 * @param {Object} fiatCurrencies
 * @return {Object} {etc: 123.0, btc: 12345.01, ...}
 */
export async function ticker(currencies, fiatCurrencies) {
  const items = await Promise.all(currencies.map(currency => request({
    url: 'https://crix-api.upbit.com/v1/crix/trades/ticks',
    qs: {
      code: `CRIX.UPBIT.KRW-${currency.toUpperCase()}`,
      count: 1
    },
    method: 'GET',
    json: true
  })))
  // console.log('ticker items', items)

  const result = {}
  if (items) {
    items.forEach((item, index) => {
      result[currencies[index]] = item[0].tradePrice
    })
  }
  return result
}

// not suported
export async function balance(config) {
  return
}

export function render() {
  return
}
