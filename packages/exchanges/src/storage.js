
import * as korbit from './exchanges/korbit'
import * as bitfinex from './exchanges/bitfinex'
import * as upbit from './exchanges/upbit'
import * as binance from './exchanges/binance'
import * as cex from './exchanges/cex'
import * as bithumb from './exchanges/bithumb'
import * as coinone from './exchanges/coinone'
import * as ethereum from './wallets/ethereum'

// storage key for configuration
export const STORAGE_KEY = 'cryptoPlaces'
// exchange rate
export const EXCHANGE_RATE_KEY = 'exchangeRate'
// settings
export const SETTINGS_KEY = 'settings'

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
