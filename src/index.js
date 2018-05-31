import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers'
import { fetchSummary } from './actions/summary'
import { fetchConfig } from './actions/config'
import { fetchExchangeRate } from './actions/exchangeRate'
// import { MemoryRouter as Router, Route } from 'react-router-dom'
import thunk from 'redux-thunk'
import { addLocaleData } from 'react-intl'
import en from 'react-intl/locale-data/en'
import ko from 'react-intl/locale-data/ko'

async function init() {
  const store = configureStore({})

  addLocaleData(en)
  addLocaleData(ko)

  // action
  const { dispatch, getState } = store

  // get exchange rate
  await fetchExchangeRate()(dispatch, getState)

  // get balance summary
  fetchSummary()(dispatch, getState)

  // get config
  await fetchConfig()(dispatch, getState)

  const component = (
    <Provider store={store}>
      <App />
    </Provider>
  )

  ReactDOM.render(component, document.getElementById('root'))
  registerServiceWorker()
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
