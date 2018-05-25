
import request from 'request-promise'
import CryptoJS from 'crypto-js'

const baseUrl = 'https://api.bithumb.com'

export async function balance(config) {
  // console.log('bithumb balance', config)

  const { apiKey, apiSecretKey } = config

  const balanceObject = await authenticateRequest({ apiKey, apiSecretKey }, '/info/balance')

  // console.log('bithumb balance', balanceObject)

  const { status, data } = balanceObject
  if ( status !== '0000') {
    // error
    throw new Error(status)
  }
  // total_currency property를 뽑아냄
  const result = {}
  Object.entries(data)
    .forEach(([ name, value ]) => {
      if ( name.startsWith('total_') ) {
        const currency = name.substring(6)
        result[currency] = Number(value)
      }
    })
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
  const nonce = Date.now() // milliseconds
  const body = `endPoint=${encodeURIComponent(urlPath)}&currency=ALL`
  const auth = `${urlPath}\0${body}\0${nonce}`
  const signature = CryptoJS.HmacSHA512(auth, apiSecretKey).toString(CryptoJS.enc.Hex)
  const signature64 = CryptoJS.enc.Latin1.parse(signature).toString(CryptoJS.enc.Base64)

  const options = {
    url,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Api-Key': apiKey,
      'Api-Sign': signature64.toString(),
      'Api-Nonce': nonce,
    },
    body,
    method: 'POST',
    json: true
  }
  // console.log('bithumb, authenticateRequest', options)

  const json = await request(options)
  return json
}

/**
 *
 * https://www.bithumb.com/u1/US127
 *
 * https://api.bithumb.com/public/ticker/{currency}
 *
{
    "status": "0000",
    "data": {
        "opening_price" : "504000",
        "closing_price" : "505000",
        "min_price"     : "504000",
        "max_price"     : "516000",
        "average_price" : "509533.3333",
        "units_traded"  : "14.71960286",
        "volume_1day"   : "14.71960286",
        "volume_7day"   : "15.81960286",
        "buy_price"     : "505000",
        "sell_price"    : "504000",
        "date"          : 1417141032622
    }
}
 * @param {*} currencies
 */
export async function ticker(currencies, fiatCurrencies) {
  const items = await Promise.all(
    currencies
    .filter(currency => currency !== 'gsc')
    .map(currency => {
      const options = {
        uri: `${baseUrl}/public/ticker/${currency}`,
        method: 'GET',
        json: true
      }
      return request(options)
    }))

  // console.log('bithumb ticker', items)

  const prices = {}
  items.forEach((item, index) => {
    const { status, data } = item
    if (status === '0000') {
      const { closing_price } = data
      prices[currencies[index]] = Number(closing_price)
    }
  })
  return prices
}
