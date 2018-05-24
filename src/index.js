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
import { MemoryRouter as Router, Route } from 'react-router-dom'
import thunk from 'redux-thunk'

async function init() {
  const store = configureStore({})

  const component = (
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  )

  // action
  const { dispatch, getState } = store

  // 환율을 얻고 fetchSummary()로 간다.
  await fetchExchangeRate()(dispatch, getState)
  fetchSummary()(dispatch, getState)
  fetchConfig()(dispatch, getState)

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
