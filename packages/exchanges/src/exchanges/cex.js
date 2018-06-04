
import request from 'request-promise'
import { publicRequest } from '../base'
import crypto from 'crypto'

const baseUrl = 'https://cex.io'

/**
 *
 * https://cex.io/rest-api#ticker
 *
 * GET https://cex.io/api/ticker/{symbol1}/{symbol2}
 *
 * e.g, https://cex.io/api/ticker/BTC/USD
 *
 * result
 * {
 *   "timestamp":"1525703559",
 *   "low":"9226",
 *   "high":"9649.7",
 *   "last":"9321.1",
 *   "volume":"512.82113373",
 *   "volume30d":"22122.86330425",
 *   "bid":9308.5,
 *   "ask":9320.8
 * }
 *
 * @param {Array} currencies
 * @param {Object} { usd }
 * @return { btc: 51300000, etc: nnn, ... }
 */
export async function ticker(currencies, fiatCurrencies) {
// async function tickers(currencies) {
  const urlPath = '/api/ticker'
  const currencyList = [].concat(currencies)
  const paths = currencyList
    .map(currency => `/${currency.toUpperCase()}/USD`)
  const tickers = await Promise.all(
    paths.map(path => publicRequest(`${baseUrl}${urlPath}${path}`))
  )

  const { usd: usd2krw } = fiatCurrencies
  const result = {}
  tickers.forEach( (ticker, index) => {
    if (ticker && ticker.last) {
      const currency = currencyList[index]
      result[currency.toLowerCase()] = usd2krw * Number(ticker.last)
    }
  })

  // console.log('cex ticker', result)

  return result
}

/**
 *
 * https://cex.io/rest-api#account-balance
 *
 * e.g, POST https://cex.io/api/balance/
 *
 * result
  { timestamp: '1525710912',
    username: 'up110557473',
    BTC: { available: '0.00000000', orders: '0.00000000' },
    ETH: { available: '3.98268300', orders: '0.00000000' },
    USD: { available: '2.61', orders: '0.00' },
    BCH: { available: '0.00000000', orders: '0.00000000' },
    BTG: { available: '0.00000000', orders: '0.00000000' },
    DASH: { available: '0.00000000', orders: '0.00000000' },
    XRP: { available: '0.000000', orders: '0.000000' },
    XLM: { available: '0.0000000', orders: '0.0000000' },
    ZEC: { available: '0.00000000', orders: '0.00000000' },
    EUR: { available: '0.00', orders: '0.00' },
    GBP: { available: '0.00', orders: '0.00' },
    RUB: { available: '0.00', orders: '0.00' },
    GHS: { available: '0.00000000', orders: '0.00000000' }
  }
 *
 * @param {Object} config {
 *   apiKey,
 *   apiSecretKey
 * }
 * @return { btc: 100, etc: nnn, ... }
 */
export async function balance(config) {
// async function balance() {
  const urlPath = `/api/balance/`

  const result = await authenticateRequest(config, `${baseUrl}${urlPath}`)
  const prices = {}
  Object.entries(result).forEach( ([currency, info]) => {
    if (info.available && Number(info.available) > 0) {
      prices[currency.toLowerCase()] = Number(info.available) + Number(info.orders)
    }
  })

  // console.log('balance', prices)

  return prices
}

/**
 *
 * @param {Object} {
 *   apiKey,
 *   apiSecretKey
 * }
 * @param {String} url
 */
async function authenticateRequest({ apiKey, apiSecretKey, userId }, url) {
  const nonce = new Date().getTime()
  const string = `${nonce}${userId}${apiKey}`
  const payload = string
  const signature = crypto
    .createHmac('sha256', Buffer.from(apiSecretKey))
    .update(payload)
    .digest('hex')

  const body = `key=${apiKey}&signature=${signature.toUpperCase()}&nonce=${nonce}`

  const options = {
    url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
    body,
    json: true
  }

  // console.log('cex balance options', options)

  const json = await request(options)
  return json
}
