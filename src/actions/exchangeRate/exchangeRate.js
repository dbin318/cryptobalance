import request from 'request-promise'

/**
 * 환율정보 by 한국수출입은행
 *
 * https://www.koreaexim.go.kr/site/program/openapi/openApiView?menuid=001003002002001&apino=2&viewtype=C
 *
 *
 * request =
 * https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=0BgMJQwatoqRxc2GFDclklPIWFF5RpUv&searchdate=20180518&data=AP01
 *
 * result =
 * [ {"result":1,"cur_unit":"USD","ttb":"1,069.2","tts":"1,090.8","deal_bas_r":"1,080","bkpr":"1,080","yy_efee_r":"0","ten_dd_efee_r":"0","kftc_bkpr":"1,080","kftc_deal_bas_r":"1,080","cur_nm":"미국 달러"} ]
 *
 * 비영업일의 데이터, 혹은 영업당일 11시 이전에 해당일의 데이터를 요청할 경우 null 값이 반환
 *
 * @param {*} usd
 */

const apiKey = '0BgMJQwatoqRxc2GFDclklPIWFF5RpUv'

/**
 *
 * get today exchange rate
 * usd only
 *
 * @return { date: YYYYMMDD, usd: 1070 }
 * { date: YYYYMMDD, usd: -1  } if the exchange rate is unavailable
 */
export async function getExchangeRate() {
  const url = 'https://www.koreaexim.go.kr/site/program/financial/exchangeJSON'
  const date = getYYYYMMDD()
  const qs = {
    authkey: apiKey,
    searchdate: date,
    data: 'AP01'
  }
  const options = {
    url,
    qs,
    method: 'GET',
    json: true
  }

  console.log('options', options)

  const result = await request(options)
  console.log('getExchangeRate', result)

  if (result) {
    const usd = result.find(item => item.cur_unit === 'USD')
    if (usd) {
      const { deal_bas_r: exchangeRate } = usd
      // remove comma in exchangeRate, exchangeRate = "1,080"
      return {
        date,
        usd: Number(exchangeRate.replace(',', ''))
      }
    }
  }

  return {
    date,
    usd: -1
  }
}


export function getYYYYMMDD() {
  const date = new Date()
  const YYYYMMDD = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${date.getDate()}`
  return YYYYMMDD
}
