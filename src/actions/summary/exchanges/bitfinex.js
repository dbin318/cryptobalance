import crypto from 'crypto'
import request from 'request-promise'
import { publicRequest } from '../base'

/**
 * https://bitfinex.readme.io/v2/reference
 *
 */
const baseUrl = 'https://api.bitfinex.com'

/**
 *
 * @see https://docs.bitfinex.com/v1/reference#rest-auth-wallet-balances
 *
 * result
 * [ { type: 'deposit',
    currency: 'btc',
    amount: '3.50249705',
    available: '0.00636581' },
  { type: 'deposit',
    currency: 'eth',
    amount: '27.12410837',
    available: '0.01410837' },
  { type: 'exchange',
    currency: 'btc',
    amount: '0.0',
    available: '0.0' },
  { type: 'exchange',
    currency: 'etc',
    amount: '0.0',
    available: '0.0' },
  { type: 'exchange',
    currency: 'eth',
    amount: '0.0',
    available: '0.0' } ]

  * @param {Object} config {
  *  apiKey,
  *  apiSecretKey
  * }
  * @return { btc: 200, etc: ... }
  }]
 */
export async function balance(config) {
  const urlPath = '/v1/balances'
  const items = await authenticateRequest(config, urlPath)
  // aggregate amount for every wallet of each currency
  const balanceObject = items
    .filter(item => item.amount !== '0.0')
    .reduce((prev, cur) => {
      if (!prev[cur.currency]) prev[cur.currency] = 0
      prev[cur.currency] += Number(cur.amount)
      return prev
    }, {})
  return balanceObject
}

/**
 *
 * result
 * { mid: '21.915',
  bid: '21.888',
  ask: '21.942',
  last_price: '21.886',
  low: '20.023',
  high: '22.478',
  volume: '1273829.8836100802',
  timestamp: '1524931094.3769314' }

 * @param {Array} currencies ['btc', 'etc', ...]
 * @param {Object} { usd }
 * @return {Object} {btc: amount_in_krw, etc: amount_in_krw, ...}
 * @see https://bitfinex.readme.io/v1/reference#rest-public-ticker
 */
export async function ticker(currencies, fiatCurrencies) {
  // 지원되지 않는 currency를 요청할 경우 400
  currencies = currencies.filter( currency => isCurrencyTickerSupported(currency))

  const currencyList = [].concat(currencies) // make array
  const tickers = await Promise.all(currencyList.map(currency => publicRequest(`${baseUrl}/v1/pubticker/${currency}usd`)))
  const { usd: usd2krw } = fiatCurrencies
  const result = {}
  tickers.forEach((ticker, index) => result[currencies[index]] = usd2krw * Number(ticker.last_price))
  return result
}

/**
 * authentication이 필요한 request
 *
 * @param {Object} config
 * @param {*} urlPath
 */
async function authenticateRequest({ apiKey, apiSecretKey }, urlPath) {
  const url = `${baseUrl}${urlPath}`
  const nonce = Date.now().toString()
  const body = {
    request: urlPath,
    nonce
  }
  const payload = new Buffer(JSON.stringify(body)).toString('base64')
  const signature = crypto
    .createHmac('sha384', apiSecretKey)
    .update(payload)
    .digest('hex')

  const options = {
    url,
    headers: {
      'X-BFX-APIKEY': apiKey,
      'X-BFX-PAYLOAD': payload,
      'X-BFX-SIGNATURE': signature
    },
    body: JSON.stringify(body),
    method: 'POST',
    json: true
  }

  const json = await request(options)
  return json
}

const supportedCurrencies = ['btc', 'etc', 'eth', 'xrp', 'bch', 'ltc']
/**
 * currency가 ticker에 의해서 지원되는가
 * @param {*} currency
 */
function isCurrencyTickerSupported(currency) {
  return supportedCurrencies.indexOf(currency) >= 0
}
