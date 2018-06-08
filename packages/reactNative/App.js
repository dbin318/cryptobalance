import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createBottomTabNavigator } from 'react-navigation'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import rootReducer from './reducers'
import { fetchSummary } from './actions/summary'
import { fetchConfig } from './actions/config'
import { fetchExchangeRate } from './actions/exchangeRate'
import BalanceScreen from './screens/BalanceScreen'
import ApiScreen from './screens/ApiScreen'
import SettingsScreen from './screens/SettingsScreen'
import AboutScreen from './screens/AboutScreen'

// https://github.com/tradle/react-native-crypto
import './shim.js'

let store

async function init() {
  store = configureStore({})

  // action
  const { dispatch, getState } = store

  // get exchange rate
  await fetchExchangeRate()(dispatch, getState)

  // get balance summary
  fetchSummary()(dispatch, getState)

  // get config
  await fetchConfig()(dispatch, getState)
}

function configureStore(initialState) {
  // const helpers = createHelpers(helpersConfig);
  const middleware = [
    thunk.withExtraArgument()
  ]

  const enhancer = applyMiddleware(...middleware)

  // See https://github.com/rackt/redux/releases/tag/v3.1.0
  const store = createStore(rootReducer, initialState, enhancer)

  return store
}

init()

export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Provider store={store}>
        <TabNavigator />
      </Provider>
    )
  }
}

const TabNavigator = createBottomTabNavigator({
  Balance: BalanceScreen,
  Api: ApiScreen,
  Settings: SettingsScreen,
  About: AboutScreen
}, {
  initialRouteName: 'Balance',
  tabBarOptions: {
    activeTintColor: '#e91e63',
    labelStyle: {
      fontSize: 12,
    },
    style: {
      backgroundColor: 'blue',
    },
  },
})
