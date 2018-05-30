
import React, { Fragment } from 'react'
import { ButtonGroup, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Header from './Header'
import { exchanges, wallets } from '../actions/summary/storage'
import { FormattedMessage } from 'react-intl'

const About = () => (
  <Fragment>
    <p />
      <FormattedMessage id='about.description' />
    <p />
      <FormattedMessage id='about.supported-exchanges' />
    <ul>
      {Object.keys(exchanges).map(exchange =>
        <li>
          { exchange }
        </li>
      )}
    </ul>
    <p />
    <FormattedMessage id='about.supported-wallets' />
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
