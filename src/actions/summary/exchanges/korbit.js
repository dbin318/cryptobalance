
import request from 'request-promise'

let headers, authenticated = false
const apiEndPoint = 'https://api.korbit.co.kr'

/**
 * kor api
 * https://apidocs.korbit.co.kr/
 */

function isAuthenticated() {
  return authenticated
}

/**
 * authenticate
 *
 * @param {Object} config
 */
async function authenticate({ apiKey, apiSecretKey, username, password }) {
  const options = {
    uri: `${apiEndPoint}/v1/oauth2/access_token`,
    qs: {
      client_id: apiKey,
      client_secret: apiSecretKey,
      username,
      password,
      grant_type: 'password',
    },
    method: 'POST',
    json: true, // Automatically parses the JSON string in the response
  }
  const json = await request(options)

  const { access_token: accessToken, refresh_token: refreshToken } = json
  headers = {
    Authorization: `Bearer ${accessToken}`
  }
  authenticated = true
  return json
}

/**
 * balance
 *
 * GET https://api.korbit.co.kr/v1/user/balances
 *
  {
    "krw" : {
      "available" : "123000",
      "trade_in_use" : "13000",
      "withdrawal_in_use" : "0"
    },
    "btc" : {
      "available" : "1.50200000",
      "trade_in_use" : "0.42000000",
      "withdrawal_in_use" : "0.50280000"
    },
  }

 * @param {Object} config {
 *   apiKey,
 *   apiSecretKey,
 *   username,
 *   password
 * }
 * @return { btc: 0.25, etc: ... }
 */
export async function balance(config) {
  // console.log('korbit, balance', config)

  if (!isAuthenticated()) {
    // const result = await authenticate({username: 'dbin318@gmail.com', password: 'camilo354!'})
    const result = await authenticate(config)
    // console.log('authenticate', result)
  }

  const options = {
    uri: `${apiEndPoint}/v1/user/balances`,
    headers: Object.assign({}, headers),
    json: true
  }

  let balanceObject
  try {
     balanceObject = await request(options)
  } catch (err) {
    console.log(err)
  }

  // amount > 0 인 currency만 고름
  const result = {}
  Object.entries(balanceObject)
    .forEach(([ currency, { available } ]) => {
      if (Number(available) > 0) result[currency] = Number(available)
    })
  return result
}

/**
 * ticker
 * https://api.korbit.co.kr/v1/ticker?currency_pair=btc_krw
 *
 * @param {Array} array of currencies ['btc', 'etc', ...]
 * @return {Object} {etc: 123, btc:..., ...}
 */
export async function ticker(currencies, fiatCurrencies) {
  // if (!isAuthenticated()) throw new Error('authenticate')

  // 지원되지 않는 currency를 요청할 경우 400
  currencies = currencies.filter( currency => isCurrencyTickerSupported(currency))

  const items = await Promise.all(currencies.map(currency => {
    const options = {
      uri: `${apiEndPoint}/v1/ticker`,
      qs: {
        'currency_pair': `${currency}_krw` // c.f etc_krw
      },
      headers: Object.assign({}, headers),
      method: 'GET',
      json: true
    }
    return request(options)
  }))

  const prices = {}
  items.forEach((item, index) => prices[currencies[index]] = Number(item.last))
  return prices
}

const supportedCurrencies = ['btc', 'etc', 'eth', 'xrp', 'bch', 'ltc']
/**
 * currency가 ticker에 의해서 지원되는가
 * @param {*} currency
 */
function isCurrencyTickerSupported(currency) {
  return supportedCurrencies.indexOf(currency) >= 0
}

