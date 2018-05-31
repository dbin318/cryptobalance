
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Panel, Table, Button, ButtonGroup, Form, FormGroup, Col, FormControl, ControlLabel, DropdownButton, MenuItem, HelpBlock } from 'react-bootstrap'
import { setConfig } from '../../../actions/config'
import { connect } from 'react-redux'

class Ethereum extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { ethereum = {} } = this.props.config
    const { apiKey, address } = ethereum
    const { handleChange } = this

    return (
      <Fragment>
        <FormGroup controlId='apiKeyEthereum' validationState={this.validateApiKey()}>
          <ControlLabel>api key</ControlLabel>
          <FormControl
            type='text'
            placeholder='api key'
            value={apiKey}
            onChange={handleChange.bind(this, 'apiKey')}
          />
          <FormControl.Feedback />
          <HelpBlock>You can get api key </HelpBlock>
        </FormGroup>

        <FormGroup controlId='addressEthereum' validationState={this.validateAddress()}>
          <ControlLabel>address</ControlLabel>
          <FormControl
            type='text'
            placeholder='user id'
            value={address}
            onChange={handleChange.bind(this, 'addresss')}
          />
          <FormControl.Feedback />
        </FormGroup>
      </Fragment>
    )
  }

  handleChange = (name, event) => {
    const value = event.target.value
    const ethereum = Object.assign({}, this.props.config.ethereum, {
      [`${name}`]: value,
      created: Date.now()
    })
    const config = Object.assign({}, this.props.config, { ethereum })

    this.props.setConfig({ config })
  }

  validateApiKey = () => {
    const { ethereum = {} } = this.props.config
    const { apiKey: value } = ethereum

    if (value && value.length > 0) return 'success'
    return 'error'
  }

  validateAddress = () => {
    const { ethereum = {} } = this.props.config
    const { address: value } = ethereum

    if (value && value.length > 0) return 'success'
    return 'error'
  }
}

Ethereum.propTypes = {
  config: PropTypes.object.isRequired
}

const mapStateToProps = ({ config: configState }) => {
  const { config = {} } = configState
  return { config }
}

const mapDispatchToProps = {
  setConfig
}

export default connect(mapStateToProps, mapDispatchToProps)(Ethereum)
