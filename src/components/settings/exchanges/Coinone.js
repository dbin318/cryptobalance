
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Panel, Table, Button, ButtonGroup, Form, FormGroup, Col, FormControl, ControlLabel, DropdownButton, MenuItem, HelpBlock } from 'react-bootstrap'
import { setConfig } from '../../../actions/config'
import { connect } from 'react-redux'

class Coinone extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { coinone = {} } = this.props.config
    const { apiKey, apiSecretKey } = coinone
    const { handleChange } = this

    return (
      <Fragment>
        <FormGroup controlId='apiKeyCoinone' validationState={this.validateApiKey()}>
          <ControlLabel>api key</ControlLabel>
          <FormControl
            type='text'
            placeholder='api key'
            value={apiKey}
            onChange={handleChange.bind(this, 'apiKey')}
          />
          <FormControl.Feedback />
          <HelpBlock>You can get api key at <a href='https://coinone.co.kr/developer/app/' target='_blank'>here</a></HelpBlock>
        </FormGroup>

        <FormGroup controlId='apiSecretKeyCoinone' validationState={this.validateApiSecretKey()}>
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
    const coinone = Object.assign({}, this.props.config.coinone, {
      [`${name}`]: value,
      created: Date.now()
    })
    const config = Object.assign({}, this.props.config, { coinone })

    console.log('Coinone handleChange', config)

    this.props.setConfig(config)
  }

  validateApiKey = () => {
    const { coinone = {} } = this.props.config
    const { apiKey: value } = coinone

    if (value && value.length > 0) return 'success'
    return 'error'
  }

  validateApiSecretKey = () => {
    const { coinone = {} } = this.props.config
    const { apiSecretKey: value } = coinone

    if (value && value.length > 0) return 'success'
    return 'error'
  }
}

Coinone.propTypes = {
  config: PropTypes.object.isRequired
}

const mapDispatchToProps = {
  setConfig
}

const mapStateToProps = ({ config: configState }) => {
  const { config = {} } = configState
  return { config }
}

export default connect(mapStateToProps, mapDispatchToProps)(Coinone)
