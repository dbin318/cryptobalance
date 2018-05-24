import crypto from 'crypto'
import request from 'request-promise'
import { publicRequest } from '../base'

/**
 *
 * binance api docs
 * https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md
 *
 *
 */
const baseUrl = 'https://api.binance.com'

/**
 * GET /api/v3/account
 *
 * https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#account-information-user_data
 *
 * e.g, result
{
  "makerCommission": 15,
  "takerCommission": 15,
  "buyerCommission": 0,
  "sellerCommission": 0,
  "canTrade": true,
  "canWithdraw": true,
  "canDeposit": true,
  "updateTime": 123456789,
  "balances": [
    {
      "asset": "BTC",
      "free": "4723846.89208129",
      "locked": "0.00000000"
    },
    {
      "asset": "LTC",
      "free": "4763368.68006011",
      "locked": "0.00000000"
    }
  ]
}
 * @param {Object} config {
 *   apiKey,
 *   apiSecretKey
 * }
 * @return { btc: 100, etc: nnn, ... }
 */

export async function balance(config) {
//async function balance() {
  const urlPath = '/api/v3/account'
  const result = await authenticateRequest(config, urlPath)
  const { balances } = result

  // assets = { btc: 100, etc: xxx, ... }
  const prices = balances
    .filter(balance => Number(balance.free) > 0 || Number(balance.locked) > 0)
    .reduce((prev, balance) => {
      prev[balance.asset.toLowerCase()] = Number(balance.free) + Number(balance.locked)
      return prev
    }, {})
  //console.log('balance', prices)

  return prices
}

/**
 * authentication이 필요한 request
 *
 * @param {Object} {
 *   apiKey,
 *   apiSecretKey
 * }
 * @param {String} urlPath
 */
async function authenticateRequest({ apiKey, apiSecretKey }, urlPath) {
  const recvWindow = 5000 // ms
  const now = Date.now()
  const queryString = `recvWindow=${recvWindow}&timestamp=${now}`

  const payload = new Buffer(queryString).toString()
  const signature = crypto
    .createHmac('sha256', apiSecretKey)
    .update(payload)
    .digest('hex')
  const url = `${baseUrl}${urlPath}?${queryString}&signature=${signature}`

  // console.log('url', url)

  const options = {
    url,
    headers: {
      'X-MBX-APIKEY': apiKey
    },
    method: 'GET',
    json: true
  }

  const json = await request(options)
  return json
}

/**
 *
 * GET /api/v3/ticker/price
 *
 * https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#symbol-price-ticker
 *
 * e.g, result
  [
    {
      "symbol": "LTCBTC",
      "price": "4.00000200"
    },
    {
      "symbol": "ETHBTC",
      "price": "0.07946600"
    }
  ]
 * @param {Array} currencies
 * @param {Object} { usd }
 * @return { btc: 100, etc: nnn, ... }
 */
export async function ticker(currencies, fiatCurrencies) {
//async function ticker(currencies) {
  const urlPath = '/api/v3/ticker/price'

  // make array
  const currencyList = [].concat(currencies)
  const params = currencyList
    .filter(currency => currency !== 'btc' && currency !== 'gsc')
    .map(currency => `${currency.toUpperCase()}BTC`)
    .concat('BTCUSDT')
  // console.log('params', params)

  const tickers = await Promise.all(
    params.map(symbol => publicRequest(`${baseUrl}${urlPath}?symbol=${symbol}`))
  )

  // console.log('tickers', tickers)

  // get btc price
  const btcTicker = tickers.find(ticker => ticker.symbol === 'BTCUSDT')
  // console.log('btc ticker', btcTicker)
  const btcPrice = Number(btcTicker.price)

  const { usd: usd2krw } = fiatCurrencies
  const result = {}
  tickers.forEach( ticker => {
    result[ticker.symbol.substring(0, 3).toLowerCase()] =
      ticker.symbol === 'BTCUSDT' ?
        Number(ticker.price) * usd2krw :
        Number(ticker.price) * usd2krw * btcPrice
  })

  // console.log('result', result)

  return result
}

