

// storage key for configuration
export const STORAGE_KEY = 'cryptoPlaces'
// exchange rate
export const EXCHANGE_RATE_KEY = 'exchangeRate'
// settings
export const SETTINGS_KEY = 'settings'

export function get(key) {
  const value = window.localStorage[key]
  if (value) return JSON.parse(value)
}

export function set(key, value) {
  window.localStorage[key] = JSON.stringify(value)
}

