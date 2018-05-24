
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Panel, Table, Button, ButtonGroup, Form, FormGroup, Col, FormControl, ControlLabel, DropdownButton, MenuItem, HelpBlock } from 'react-bootstrap'
import { setConfig } from '../../../actions/config'
import { connect } from 'react-redux'

class Bitfinex extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { bitfinex = {} } = this.props.config
    const { apiKey, apiSecretKey } = bitfinex
    const { handleChange } = this

    return (
      <Fragment>
        <FormGroup controlId='apiKeyBitfinex' validationState={this.validateApiKey()}>
          <ControlLabel>api key</ControlLabel>
          <FormControl
            type='text'
            placeholder='api key'
            onChange={handleChange.bind(this, 'apiKey')}
            value={apiKey}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup controlId='apiSecretKeyBitfinex' validationState={this.validateApiSecretKey()}>
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
    const bitfinex = Object.assign({}, this.props.config.bitfinex, {
      [`${name}`]: value,
      created: Date.now()
    })
    const config = Object.assign({}, this.props.config, { bitfinex })

    this.props.setConfig(config)
  }

  validateApiKey = () => {
    const { bitfinex = {} } = this.props.config
    const { apiKey: value } = bitfinex

    if (value && value.length > 0) return 'success'
    return 'error'
  }

  validateApiSecretKey = () => {
    const { bitfinex = {} } = this.props.config
    const { apiSecretKey: value } = bitfinex

    if (value && value.length > 0) return 'success'
    return 'error'
  }
}

Bitfinex.propTypes = {
  config: PropTypes.object.isRequired
}

const mapDispatchToProps = {
  setConfig
}

const mapStateToProps = ({ config: configState }) => {
  const { config = {} } = configState
  return { config }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bitfinex)

