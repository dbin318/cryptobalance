
import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import Header from '../Header'
import { get, set, STORAGE_KEY } from '../../actions/summary/storage'
import { wallets, exchanges as oldExchanges } from '@cryptobalance/exchanges'
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

class CreateApi extends Component {
  constructor (props) {
    super(props)

    // API를 제공하지 않는 exchanges는 거름
    const exchanges = this.filterExchanges(oldExchanges)
    this.supportedCryptoPlaces = Object.assign({}, exchanges, wallets)
    console.log('CreateApi crypto', this.supportedCryptoPlaces)

    const defaultCryptoPlace = Object.keys(this.supportedCryptoPlaces)[0]

    // cryptoPlace가 route에서 전달되었는지 확인
    const cryptoPlace = this.props.location && this.props.location.state && this.props.location.state.cryptoPlace || defaultCryptoPlace

    console.log('CreateApi', cryptoPlace, this.props.location.state)

    this.state = { cryptoPlace }
  }

  render() {
    const { onSave, onCancel, onSelect, supportedCryptoPlaces } = this
    const { cryptoPlace } = this.state

    return (
      <Fragment>
        <ButtonGroup>
          <Button onClick={onSave}><FormattedMessage id='api.save'/></Button>
          <Button onClick={onCancel}><FormattedMessage id='api.cancel'/></Button>
        </ButtonGroup>

        <form>
          <FormGroup controlId='place'>
            <ControlLabel><FormattedMessage id='api.exchanges-wallets'/></ControlLabel>
            <FormControl
              componentClass='select'
              placeholder='select'
              onChange={onSelect}
              value={cryptoPlace}
            >
              {Object.entries(supportedCryptoPlaces).map(([name, config]) => (
                <option value={name}>{name}</option>
              ))}
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

    await this.props.pushConfig({ config })

    history.replace('/api', {})
  }

  onCancel = () => {
    console.log('cancel')

    const { history } = this.props
    history.replace('/api', {})
  }
}

CreateApi.propTypes = {
  config: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
}

const mapDispatchToProps = {
  pushConfig
}

const mapStateToProps = ({ config: configState }) => {
  const { config } = configState

  return { config }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateApi))
