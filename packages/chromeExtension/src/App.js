import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import { MemoryRouter as Router, Route } from 'react-router-dom'
import Header from './components/Header'
import Balance from './components/Balance'
import Api from './components/api/Api'
import CreateApi from './components/api/CreateApi'
import ExportApi from './components/api/ExportApi'
import ImportApi from './components/api/ImportApi'
import About from './components/About'
import Settings from './components/settings/Settings'
import { connect } from 'react-redux'
import i18nConfigKo from './messages/ko'
import i18nConfigEn from './messages/en'
import { IntlProvider } from 'react-intl'
import PropTypes from 'prop-types'

class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    // console.log('App language', this.getDefaultLanguage())

    const { settings: { language = this.getDefaultLanguage(), currency = this.getDefaultCurrency() } } = this.props
    const { messages } = language === 'ko' ? i18nConfigKo : i18nConfigEn

    return (
      <IntlProvider
        locale={language}
        messages={messages}
      >
        <Router>
          <div className='container'>
            <Header />
            <Route exact path='/' component={Balance} />
            <Route exact path='/api' component={Api} />
            <Route exact path='/api/create' component={CreateApi} />
            <Route exact path='/api/export' component={ExportApi} />
            <Route exact path='/api/import' component={ImportApi} />
            <Route exact path='/about' component={About} />
            <Route exact path='/settings' component={Settings} />
          </div>
        </Router>
      </IntlProvider>
    )
  }

  getDefaultLanguage = () => {
    let language
    if (window.navigator.languages) {
        language = window.navigator.languages[0];
    } else {
        language = window.navigator.userLanguage || window.navigator.language;
    }
    return language
  }

  getDefaultCurrency = () => {
    const language = this.getDefaultLanguage()

    return language === 'ko' ? 'krw' : 'usd'
  }

}

App.propTypes = {
  settings: PropTypes.object.isRequired,
}

const mapStateToProps = ({ config: configState }) => {
  const { settings } = configState
  return { settings }
}

export default connect(mapStateToProps)(App)
