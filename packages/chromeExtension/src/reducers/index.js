
import { combineReducers } from 'redux'
import summary from './summary'
import config from './config'
import exchangeRate from './exchangeRate'

const rootReducer = combineReducers({
  summary,
  config,
  exchangeRate,
})

export default rootReducer
