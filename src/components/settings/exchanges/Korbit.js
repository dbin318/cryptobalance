
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Panel, Table, Button, ButtonGroup, Form, FormGroup, Col, FormControl, ControlLabel, DropdownButton, MenuItem, HelpBlock } from 'react-bootstrap'
import { setConfig } from '../../../actions/config'
import { connect } from 'react-redux'

class Korbit extends Component {
  constructor(props) {
    super(props)

    // console.log('Korbit config', this.props.config)
  }

  render() {
    const { korbit = {} } = this.props.config
    const { apiKey, apiSecretKey, username, password } = korbit
    const { handleChange } = this

    return (
      <Fragment>
        <FormGroup controlId='apiKeyKorbit'  validationState={this.validateApiKey()}>
          <ControlLabel>api key</ControlLabel>
          <FormControl
            type='text'
            value={apiKey}
            placeholder='api key'
            onChange={handleChange.bind(this, 'apiKey')}
          />
          <FormControl.Feedback />
          <HelpBlock> </HelpBlock>
        </FormGroup>

        <FormGroup controlId='apiSecretKeyKorbit' validationState={this.validateApiSecretKey()}>
          <ControlLabel>api secret key</ControlLabel>
          <FormControl
            type='text'
            value={apiSecretKey}
            placeholder='api secret key'
            onChange={handleChange.bind(this, 'apiSecretKey')}
          />
          <FormControl.Feedback />
          <HelpBlock> </HelpBlock>
        </FormGroup>

        <FormGroup controlId='userNameKorbit'  validationState={this.validateUserName()}>
          <ControlLabel>user id</ControlLabel>
          <FormControl
            type='text'
            value={username}
            placeholder='user name'
            onChange={handleChange.bind(this, 'username')}
          />
          <FormControl.Feedback />
          <HelpBlock> </HelpBlock>
        </FormGroup>

        <FormGroup controlId='passwordKorbit'  validationState={this.validatePassword()}>
          <ControlLabel>password</ControlLabel>
          <FormControl
            type='password'
            value={password}
            placeholder='password'
            onChange={handleChange.bind(this, 'password')}
          />
          <FormControl.Feedback />
          <HelpBlock> </HelpBlock>
        </FormGroup>
      </Fragment>
    )
  }

  handleChange = (name, event) => {
    const value = event.target.value
    const korbit = Object.assign({}, this.props.config.korbit, {
      [`${name}`]: value,
      created: Date.now()
    })
    const config = Object.assign({}, this.props.config, { korbit })

    this.props.setConfig(config)
  }

  validateApiKey = () => {
    const { korbit = {} } = this.props.config
    const { apiKey: value } = korbit

    if (value && value.length > 0) return 'success'
    return 'error'
  }

  validateApiSecretKey = () => {
    const { korbit = {} } = this.props.config
    const { apiSecretKey: value } = korbit

    if (value && value.length > 0) return 'success'
    return 'error'
  }

  validateUserName = () => {
    const { korbit = {} } = this.props.config
    const { username: value } = korbit

    if (value && value.length > 0) return 'success'
    return 'error'
  }

  validatePassword = () => {
    const { korbit = {} } = this.props.config
    const { password: value } = korbit

    if (value && value.length > 0) return 'success'
    return 'error'
  }
}

Korbit.propTypes = {
  config: PropTypes.object.isRequired
}

const mapStateToProps = ({ config: configState }) => {
  const { config = {} } = configState
  return { config }
}

const mapDispatchToProps = {
  setConfig
}

export default connect(mapStateToProps, mapDispatchToProps)(Korbit)
