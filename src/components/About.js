
import React, { Fragment } from 'react'
import { ButtonGroup, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Header from './Header'
import { exchanges, wallets } from '../actions/summary/storage'

const About = () => (
  <Fragment>
    <p />
      Cryptobalance accumulates the balance of crypto exchanges and wallets in real-time.
    <p />
      supported exchanges
    <ul>
      {Object.keys(exchanges).map(exchange =>
        <li>
          { exchange }
        </li>
      )}
    </ul>
    <p />
      supported wallets
    <ul>
      {Object.keys(wallets).map(wallet =>
        <li>
          { wallet }
        </li>
      )}
    </ul>
    <p />
    github - <a href='https://github.com/dbin318/cryptobalance' target='_blank'>https://github.com/dbin318/cryptobalance</a>
  </Fragment>
)

export default About
