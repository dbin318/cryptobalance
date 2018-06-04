
import crypto from 'crypto'
import request from 'request-promise'

const baseUrl = 'https://api.coinone.co.kr'

/**
 *
 * http://doc.coinone.co.kr/#api-Account_V2-UserBalance
 *
 * request = https://api.coinone.co.kr/v2/account/balance/
 * result =
 * {
 *   result,
 *   errorCode,
 *   btc: {
 *     avail: ,
 *     balance:
 *   },
 *   eth: {
 *   }
 * }
 *
 * @param {Object} {
 *   apiKey,
 *   apiSecretKey
 * }
 */
export async function balance(config) {
  const urlPath = '/v2/account/balance/'

  const result = await authenticateRequest(config, urlPath)
  // console.log('coinone balance', result)

  const prices = Object.entries(result)
    .filter(([key, value]) => value && value.balance && value.balance > 0)
    .reduce((prev, [key, value]) => {
      prev[key] = value.balance
      return prev
    }, {})
  return prices
}

/**
 * http://doc.coinone.co.kr/#api-Public-Ticker
 *
 * result =
{
  "result": "success",
  "errorCode": "0",
  "first": "13045000",
  "last": "12749000",
  "high": "13636000",
  "low": "12350000",
  "volume": "2081.0240",
  "yesterday_first": "13320000",
  "yesterday_last": "12912000",
  "yesterday_high": "14079000",
  "yesterday_low": "12350000",
  "yesterday_volume": "2854.2456",
  "timestamp": "1516785493",
  "currency": "btc"
}

 * @param {Array} currencies
 * @param {Object} { usd }
 */
export async function ticker(currencies, fiatCurrencies) {
  // 지원되지 않는 currency를 요청할 경우 400
  currencies = currencies.filter( currency => isCurrencyTickerSupported(currency))

  const items = await Promise.all(currencies.map(currency => request({
    uri: `${baseUrl}/ticker`,
    qs: { currency },
    method: 'GET',
    json: true
  })))

  const prices = {}
  items.forEach(item => {
    // success
    if (item.result === 'success') prices[item.currency] = Number(item.last)
  })
  return prices

}


const supportedCurrencies = ['btc', 'bch', 'eth', 'etc', 'xrp', 'qtm', 'iota', 'ltc', 'btg', 'omg', 'eos', 'all']
/**
 * currency가 ticker에 의해서 지원되는가
 * @param {*} currency
 */
function isCurrencyTickerSupported(currency) {
  return supportedCurrencies.indexOf(currency) >= 0
}

/**
 *
 * @param {Object} { apiKey, apiSecretKey }
 * @param {String} urlPath
 */
async function authenticateRequest({ apiKey, apiSecretKey }, urlPath) {
  const url = `${baseUrl}${urlPath}`

  const payload = new Buffer(JSON.stringify({
    access_token: apiKey,
    nonce: Date.now()
  })).toString('base64')

  const signature = crypto
    .createHmac('sha512', apiSecretKey.toUpperCase())
    .update(payload)
    .digest('hex')

  const headers = {
    'content-type': 'application/json',
    'X-COINONE-PAYLOAD': payload,
    'X-COINONE-SIGNATURE': signature
  }

  const options = {
    url,
    headers,
    body: payload,
    method: 'POST',
    json: true
  }

  const result = await request(options)
  return result
}
