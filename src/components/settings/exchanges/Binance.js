
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Panel, Table, Button, ButtonGroup, Form, FormGroup, Col, FormControl, ControlLabel, DropdownButton, MenuItem, HelpBlock } from 'react-bootstrap'
import { setConfig } from '../../../actions/config'
import { connect } from 'react-redux'

class Binance extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { binance = {} } = this.props.config
    const { apiKey, apiSecretKey } = binance
    const { handleChange } = this

    return (
      <Fragment>
        <FormGroup controlId='apiKeyBinance' validationState={this.validateApiKey()}>
          <ControlLabel>api key</ControlLabel>
          <FormControl
            type='text'
            placeholder='api key'
            value={apiKey}
            onChange={handleChange.bind(this, 'apiKey')}
          />
          <FormControl.Feedback />
          <HelpBlock>You can get api key at <a href='https://www.binance.com/userCenter/createApi.html' target='_blank'>here</a></HelpBlock>
        </FormGroup>

        <FormGroup controlId='apiSecretKeyBinance' validationState={this.validateApiSecretKey()}>
          <ControlLabel>api secret key</ControlLabel>
          <FormControl
            type='text'
            placeholder='api secret key'
            value={apiSecretKey}
            onChange={handleChange.bind(this, 'apiSecretKey')}
          />
          <FormControl.Feedback />
        </FormGroup>
      </Fragment>
    )
  }

  handleChange = (name, event) => {
    const value = event.target.value
    const binance = Object.assign({}, this.props.config.binance, {
      [`${name}`]: value,
      created: Date.now()
    })
    const config = Object.assign({}, this.props.config, { binance })

    this.props.setConfig(config)
  }

  validateApiKey = () => {
    const { binance = {} } = this.props.config
    const { apiKey: value } = binance

    if (value && value.length > 0) return 'success'
    return 'error'
  }

  validateApiSecretKey = () => {
    const { binance = {} } = this.props.config
    const { apiSecretKey: value } = binance

    if (value && value.length > 0) return 'success'
    return 'error'
  }
}

Binance.propTypes = {
  config: PropTypes.object.isRequired
}

const mapDispatchToProps = {
  setConfig
}

const mapStateToProps = ({ config: configState }) => {
  const { config = {} } = configState
  return { config }
}

export default connect(mapStateToProps, mapDispatchToProps)(Binance)
