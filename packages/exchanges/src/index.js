
import * as korbit from './exchanges/korbit'
import * as bitfinex from './exchanges/bitfinex'
import * as upbit from './exchanges/upbit'
import * as binance from './exchanges/binance'
import * as cex from './exchanges/cex'
import * as bithumb from './exchanges/bithumb'
import * as coinone from './exchanges/coinone'
import * as ethereum from './wallets/ethereum'

export const exchanges = {
  korbit,
  bitfinex,
  upbit,
  binance,
  cex,
  bithumb,
  coinone,
}

export const wallets = {
  ethereum,
}

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

/**
 *
 * merge each exchange's balance
 *
 * @param {Object} config {
 *   korbit: {
 *     apiKey,
 *     apiSecretKey,
 *     ...
 *   }
 * }
 * @return {Object} {
 *  btc: {
 *    bitfix: 1,
 *    upbit: n,
 *  },
 *  etc: {
 *    ..
 *  }
 * }
 */
async function getBalances(configObject = {}) {
  const supportedCryptoPlaces = Object.entries(exchanges).concat(Object.entries(wallets))

  const cryptoPlaces = supportedCryptoPlaces.filter(([ name, cryptoPlace ]) => configObject[name])

  // console.log('crypto places', cryptoPlaces)

  // balance
  if (cryptoPlaces.length === 0) return {}

  const myBalances = await Promise.all(
    cryptoPlaces.map(([ name, cryptoPlace ]) => cryptoPlace.balance(configObject[name]).catch(err => {
      // ignore errors
      console.log('balance', configObject[name], err)
    }))
  )
  // console.log('balance', myBalances)

  const result = {}
  cryptoPlaces.forEach(([ name, cryptoPlace ], index) => {
    const balance = myBalances[index]
    if (balance) {
      Object.entries(balance)
        .forEach(([ currency, amount ]) => {
          if (!result[currency]) result[currency] = {}
          result[currency][name] = amount
        })
    }
  })
  return result
}

/**
 * merge each exchange's prices in krw
 *
 * @param {Object} configuration
 * @param {*} currencies
 * @param {Object} { usd }
 *
 * @return {Object} {
 *  btc: {
 *    bitfix: 200000,
 *    upbit: 300000,
 *    ...
 *  },
 *  etc: {
 *    ...
 *  }
 * }
 */
async function getTickers(configObject = {}, currencies, fiatCurrencies) {
  const myExchanges = Object.entries(exchanges)
    .filter(([ name, exchange ]) => configObject[name])

  if (myExchanges.length === 0) return {}

  const prices = await Promise.all(
    myExchanges.map(([ name, exchange ]) => exchange.ticker(currencies, fiatCurrencies).catch(err => {
      console.log('ticker', name, err)
    }))
  )
  // console.log('ticker api result', prices)

  // 동일 currency의 가격중에 가장 높은 max를 추가
  const result = {}
  myExchanges.forEach(([ name, exchange ], index) => {
    const price = prices[index]
    if (price) {
      Object.entries(price)
        .forEach(([ currency, priceValue ]) => {
          if (!result[currency]) result[currency] = {}
          result[currency][name] = priceValue
        })
    }
  })
  // console.log('prices', result)

  return result
}


/**
 *
 * @param {Object} { etc: { korbit: 1, bithumb: 2 , ...}, btc: {}, ... }
 */
function normalizeBalances(balances) {
  const result = {}
  Object.entries(balances).forEach(([currency, value]) => {
    let total = 0
    Object.entries(value).forEach(([exchange, amount]) => total = total + amount)
    if (total > 0) result[currency] = value
  })
  return result
}

