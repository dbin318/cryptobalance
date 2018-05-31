
import { get, set, STORAGE_KEY, SETTINGS_KEY } from '../summary/storage'

export const SET_CONFIG = 'SET_CONFIG'

export function setConfigAction(params) {
  return {
    type: SET_CONFIG,
    item: params
  }
}

export function setConfig(params) {
  return async (dispatch, getState) => {
    dispatch(setConfigAction(params))
  }
}

/**
 * storage에서 config를 가져와서 저장
 *
 */
export function fetchConfig() {
  return async (dispatch, getState) => {
    const config = get(STORAGE_KEY) || {}
    const settings = get(SETTINGS_KEY) || {}
    // console.log('fetchConfig, config', config)

    dispatch(setConfigAction({ config, settings }))
  }
}

/**
 * storage에 config를 저장
 *
 * @param {Object} { config, settings }
 */
export function pushConfig(params) {
  return async (dispatch, getState) => {
    const { config, settings } = params

    if (config) set(STORAGE_KEY, config)
    if (settings) set(SETTINGS_KEY, settings)

    console.log('pushConfig', params)

    dispatch(setConfigAction(params))
  }
}
