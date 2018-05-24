
import { getSummary } from './balance'

export const FETCH_SUMMARY = 'FETCH_SUMMARY'
export const BEGIN_SUMMARY = 'BEGIN_SUMMARY'
export const ERROR_SUMMARY = 'ERROR_SUMMARY'

export function beginSummaryAction() {
  return {
    type: BEGIN_SUMMARY
  }
}

export function createSummaryAction(summary) {
  return {
    type: FETCH_SUMMARY,
    item: summary
  }
}

export function errorSummaryAction() {
  return {
    type: ERROR_SUMMARY
  }
}

export function fetchSummary() {
  // console.log('fetchSummary')

  return async (dispatch, getState) => {
    // console.log('fetchSummary async')

    dispatch(beginSummaryAction())

    let summary
    try {
      const { exchangeRate: exchangeRateState } = getState()
      const { exchangeRate } = exchangeRateState
      console.log('fetchSummary exchangeRate', exchangeRate)

      summary = await getSummary(exchangeRate)
    } catch(error) {
      console.log(error)
      return dispatch(errorSummaryAction())
    }

    // console.log('fetchSummary', summary)

    dispatch(createSummaryAction({
      updated: Date.now(),
      summary
    }))
  }
}
