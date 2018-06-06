
import {
  getBalances,
  getTickers,
  normalizeBalances } from './summary'

export { exchanges, wallets } from './summary'

export { getExchangeRate, getYYYYMMDD } from './exchangeRate'

/**
 * get summary
 *
 * @param {Object} { korbit: {apiKey: ..., }, bitfinex: {}, ... }
 * @param {Object} { usd }
 * @return {
    btc: {
      bitfinex: {
        price: 300000000,
        amount: 1000
      },
      korbit: {
        price: ...,
        amount: 100
      },
      total: {
        price: ..., // max
        amount: ...
      }
    },
    etc: {
    },
    usd: {
      korbit: {
        price: xxx,
        amount: 1000,
      }
    },
    krw: {
      korbit: {
        amount: 11,
        price: 1223,
      }
    },
    total: 121212121212212
  }
 */
export async function getSummary(configObject, fiatCurrencies) {
  console.log('getSummary fiatCurrencies', fiatCurrencies)

  const balances = await getBalances(configObject)
  console.log('balances', balances)

  // remove currency if total balance is 0
  const normalizedBalances = normalizeBalances(balances)
  console.log('normalized balances', normalizedBalances)

  const currencies = Object.entries(normalizedBalances)
    .map(([ currency, values ]) => currency)
    .filter(currency => currency !== 'krw' && currency !== 'usd') // exclude krw, usd
  console.log('currencies', currencies)

  // tickers
  // {
  //   btc: {
  //     bitfinex: 3000000,
  //     korbit: ...
  //   },
  //   etc: {
  //   },
  // }
  const tickers = await getTickers(configObject, currencies, fiatCurrencies)

  const result = {}
  Object.entries(normalizedBalances)
    .forEach(([currency, balanceValue]) => {
      let totalAmount = 0
      Object.entries(balanceValue)
        .forEach(([exchangeName, amount]) => {
          if (amount > 0) {
            if (!result[currency]) result[currency] = {}
            if (!result[currency][exchangeName]) result[currency][exchangeName] = {}
            result[currency][exchangeName].amount = amount
            totalAmount += amount
          }
        })
      if (!result[currency].total) result[currency].total = {}
      result[currency].total.amount = totalAmount
    })
  // balance는 없고 ticker만 있는 경우가 있으므로 별도로 돌린다.
  Object.entries(tickers)
    .forEach(([currency, tickerValue]) => {
      let maxPrice = 0
      Object.entries(tickerValue)
        .forEach(([exchangeName, price]) => {
          if (!result[currency]) result[currency] = {}
          if (!result[currency][exchangeName]) result[currency][exchangeName] = {}

          if (price > 0) {
            result[currency][exchangeName].price = price
            if (maxPrice < price) maxPrice = price
          }
        })
      if (!result[currency].total) result[currency].total = { amount: 0 }
      result[currency].total.price = maxPrice
    })

  // fiat currency는 ticker를 갖지 않으므로 total.price를 볃도로 설정
  Object.entries(fiatCurrencies).forEach(([ fiatCurrency, price ]) => {
    if (result[fiatCurrency] && result[fiatCurrency].total && result[fiatCurrency].total.amount > 0) {
      result[fiatCurrency].total.price = price
    }
  })

  const total = Object.entries(result)
    .reduce((prev, [ currency, { total: { price = 0, amount = 0 } }]) =>
      prev + price * amount,
    0)
  if (total > 0) result.total = total

  return result
}
