
import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import Header from '../Header'
import { get, set, wallets, exchanges as oldExchanges, STORAGE_KEY } from '../../actions/summary/storage'
import { Panel, Table, Button, ButtonGroup, Form, FormGroup, Col, FormControl, ControlLabel, DropdownButton, MenuItem, Breadcrumb } from 'react-bootstrap'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { pushConfig } from '../../actions/config'
import { FormattedMessage } from 'react-intl'

import Binance from './exchanges/Binance'
import Bitfinex from './exchanges/Bitfinex'
import Cex from './exchanges/Cex'
import Korbit from './exchanges/Korbit'
import Ethereum from './wallets/Ethereum'
import Bithumb from './exchanges/Bithumb'
import Coinone from './exchanges/Coinone'

// react components
const CryptoComponents = {
  binance: <Binance />,
  bitfinex: <Bitfinex />,
  cex: <Cex />,
  korbit: <Korbit />,
  ethereum: <Ethereum />,
  bithumb: <Bithumb />,
  coinone: <Coinone />,
}

class CreateSettings extends Component {
  constructor (props) {
    super(props)

    // API를 제공하지 않는 exchanges는 거름
    const exchanges = this.filterExchanges(oldExchanges)
    this.supportedCryptoPlaces = Object.assign({}, exchanges, wallets)
    console.log('CreateSettings crypto', this.supportedCryptoPlaces)

    const defaultCryptoPlace = Object.keys(this.supportedCryptoPlaces)[0]

    // cryptoPlace가 route에서 전달되었는지 확인
    const cryptoPlace = this.props.location && this.props.location.state && this.props.location.state.cryptoPlace || defaultCryptoPlace

    console.log('CreateSettings', cryptoPlace, this.props.location.state)

    this.state = { cryptoPlace }
  }

  render() {
    console.log('CreateSettings')

    const { onSave, onCancel, onSelect, supportedCryptoPlaces } = this
    const { cryptoPlace } = this.state

    return (
      <Fragment>
        <ButtonGroup>
          <Button onClick={onSave}><FormattedMessage id='settings.save'/></Button>
          <Button onClick={onCancel}><FormattedMessage id='settings.cancel'/></Button>
        </ButtonGroup>

        <form>
          <FormGroup controlId='place'>
            <ControlLabel><FormattedMessage id='settings.exchanges-wallets'/></ControlLabel>
            <FormControl
              componentClass='select'
              placeholder='select'
              onChange={onSelect}
              value={cryptoPlace}
            >
              {Object.entries(supportedCryptoPlaces).map(([name, config]) => (
                <option value={name}>{name}</option>
              ))
              }
            </FormControl>
          </FormGroup>
          {CryptoComponents[cryptoPlace]}
        </form>
      </Fragment>
    )
  }

  filterExchanges(exchanges) {
    const newExchanges = Object.assign({}, exchanges)
    delete newExchanges.upbit
    return newExchanges
  }

  onSelect = (event) => {
    console.log('select', event.target.value)

    const cryptoPlace = event.target.value

    this.setState( { cryptoPlace })
  }

  onSave = async () => {
    console.log('save')

    const { cryptoPlace } = this.state

    const { config, history } = this.props

    // redux -> storage
    console.log('onSave', config)

    await this.props.pushConfig(config)

    history.replace('/settings', {})
  }

  onCancel = () => {
    console.log('cancel')

    const { history } = this.props
    history.replace('/settings', {})
  }
}

CreateSettings.propTypes = {
  config: PropTypes.object.isRequired
}

const mapDispatchToProps = {
  pushConfig
}

const mapStateToProps = ({ config: configState }) => {
  const { config } = configState

  return { config }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateSettings))
