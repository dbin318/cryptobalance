
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Panel, Table, Button, ButtonGroup, Form, FormGroup, Col, FormControl, ControlLabel, DropdownButton, MenuItem, HelpBlock } from 'react-bootstrap'
import { setConfig } from '../../../actions/config'
import { connect } from 'react-redux'

class Cex extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { cex = {} } = this.props.config
    const { apiKey, apiSecretKey, userId } = cex
    const { handleChange } = this

    return (
      <Fragment>
        <FormGroup controlId='apiKeyCex' validationState={this.validateApiKey()}>
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

        <FormGroup controlId='apiSecretKeyCex' validationState={this.validateApiSecretKey()}>
          <ControlLabel>api secret key</ControlLabel>
          <FormControl
            type='text'
            placeholder='api secret key'
            value={apiSecretKey}
            onChange={handleChange.bind(this, 'apiSecretKey')}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup controlId='userIdCex' validationState={this.validateUserId()}>
          <ControlLabel>user id</ControlLabel>
          <FormControl
            type='text'
            placeholder='user id'
            value={userId}
            onChange={handleChange.bind(this, 'userId')}
          />
          <FormControl.Feedback />
        </FormGroup>
      </Fragment>
    )
  }

  handleChange = (name, event) => {
    const value = event.target.value
    const cex = Object.assign({}, this.props.config.cex, {
      [`${name}`]: value,
      created: Date.now()
    })
    const config = Object.assign({}, this.props.config, { cex })

    this.props.setConfig({ config })
  }

  validateApiKey = () => {
    const { cex = {} } = this.props.config
    const { apiKey: value } = cex

    if (value && value.length > 0) return 'success'
    return 'error'
  }

  validateApiSecretKey = () => {
    const { cex = {} } = this.props.config
    const { apiSecretKey: value } = cex

    if (value && value.length > 0) return 'success'
    return 'error'
  }

  validateUserId = () => {
    const { cex = {} } = this.props.config
    const { userId: value } = cex

    if (value && value.length > 0) return 'success'
    return 'error'
  }
}

Cex.propTypes = {
  config: PropTypes.object.isRequired
}

const mapStateToProps = ({ config: configState }) => {
  const { config = {} } = configState
  return { config }
}

const mapDispatchToProps = {
  setConfig
}

export default connect(mapStateToProps, mapDispatchToProps)(Cex)

