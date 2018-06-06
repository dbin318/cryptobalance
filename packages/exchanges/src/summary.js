
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
export async function getBalances(configObject = {}) {
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
export async function getTickers(configObject = {}, currencies, fiatCurrencies) {
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
export function normalizeBalances(balances) {
  const result = {}
  Object.entries(balances).forEach(([currency, value]) => {
    let total = 0
    Object.entries(value).forEach(([exchange, amount]) => total = total + amount)
    if (total > 0) result[currency] = value
  })
  return result
}

