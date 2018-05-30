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

class App extends Component {
  render() {
    return (
      <Router>
        <div className='container'>
          <Header />
          <Route exact path='/' component={Balance} />
          <Route exact path='/api' component={Api} />
          <Route exact path='/api/create' component={CreateApi} />
          <Route exact path='/api/export' component={ExportApi} />
          <Route exact path='/api/import' component={ImportApi} />
          <Route path='/about' component={About} />
        </div>
      </Router>
    )
  }
}

export default App
