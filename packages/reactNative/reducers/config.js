
import { SET_CONFIG } from '../actions/config'

export default function config ( state = {}, action ) {
  switch(action.type) {
    case SET_CONFIG: {
      return Object.assign({}, state, {
        type: action.type,
        ...action.item
      })
    }
    default:
      return state
  }
}

