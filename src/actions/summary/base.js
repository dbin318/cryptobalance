
import request from 'request-promise'


/**
 * request with no authentication
 *
 * @param {String} url
 */
export async function publicRequest(url) {
  const options = {
    url,
    method: 'GET',
    json: true
  }
  const json = await request(options)
  return json
}

export function usd2krw(usd) {
  return usd * 1073
}

/**
 * wei to ether
 *
 * @param {*} wei
 */
export function wei2ether(wei) {
  return wei / 1000000000000000000
}
