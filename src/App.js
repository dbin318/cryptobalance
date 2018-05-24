import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import { MemoryRouter as Router, Route } from 'react-router-dom'
import Header from './components/Header'
import Balance from './components/Balance'
import Settings from './components/settings/Settings'
import CreateSettings from './components/settings/CreateSettings'
import ExportSettings from './components/settings/ExportSettings'
import ImportSettings from './components/settings/ImportSettings'
import About from './components/About'

class App extends Component {
  render() {
    return (
      <Router>
        <div className='container'>
          <Header />
          <Route exact path='/' component={Balance} />
          <Route exact path='/settings' component={Settings} />
          <Route exact path='/settings/create' component={CreateSettings} />
          <Route exact path='/settings/export' component={ExportSettings} />
          <Route exact path='/settings/import' component={ImportSettings} />
          <Route path='/about' component={About} />
        </div>
      </Router>
    )
  }
}

export default App
