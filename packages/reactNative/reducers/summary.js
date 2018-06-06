
import { FETCH_SUMMARY, BEGIN_SUMMARY, ERROR_SUMMARY } from '../actions/summary'

export default function summary ( state = {}, action ) {
  switch(action.type) {
    case FETCH_SUMMARY: {
      return Object.assign({}, state, {
        type: action.type,
        ...action.item,
      })
    }
    case BEGIN_SUMMARY: {
      return Object.assign({}, state, {
        type: action.type
      })
    }
    case ERROR_SUMMARY: {
      return Object.assign({}, state, {
        type: action.type
      })
    }
    default:
      return state
  }
}

