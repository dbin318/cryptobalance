
import { get, set, STORAGE_KEY } from '../summary/storage'

export const SET_CONFIG = 'SET_CONFIG'

export function setConfigAction(config) {
  return {
    type: SET_CONFIG,
    item: config
  }
}

export function setConfig(config) {
  return async (dispatch, getState) => {
    dispatch(setConfigAction({ config }))
  }
}

/**
 * storage에서 config를 가져와서 저장
 *
 */
export function fetchConfig() {
  return async (dispatch, getState) => {
    const config = get(STORAGE_KEY) || {}

    // console.log('fetchConfig, config', config)

    dispatch(setConfigAction({ config }))
  }
}

/**
 * storage에 config를 저장
 *
 */
export function pushConfig(config) {
  return async (dispatch, getState) => {
    set(STORAGE_KEY, config)

    console.log('pushConfig, config', config)

    dispatch(setConfigAction({ config }))
  }
}
