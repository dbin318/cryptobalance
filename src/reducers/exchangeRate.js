
import { FETCH_EXCHANGE_RATE } from '../actions/exchangeRate'

export default function exchangeRate ( state = {}, action ) {
  switch(action.type) {
    case FETCH_EXCHANGE_RATE: {
      return Object.assign({}, state, {
        type: action.type,
        ...action.item,
      })
    }
    default:
      return state
  }
}

