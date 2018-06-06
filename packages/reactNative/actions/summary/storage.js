

// storage key for configuration
export const STORAGE_KEY = 'cryptoPlaces'
// exchange rate
export const EXCHANGE_RATE_KEY = 'exchangeRate'
// settings
export const SETTINGS_KEY = 'settings'

/**
 * fetch data
 *
 * @param {String} key
 */
export async function get(key) {
  try {
    const value = await AsyncStorage.getItem(key)
    if (value) return JSON.parse(value)
  } catch (error) {
    console.error(error)
  }
}

/**
 * set data
 *
 * @param {String} key
 * @param {String} value
 */
export async function set(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(error)
  }
}

