
import React, { Fragment, Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Header from '../Header'
import { get, set, wallets, exchanges, STORAGE_KEY } from '../../actions/summary/storage'
import { Alert, Panel, Table, Button, ButtonGroup, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { pushConfig } from '../../actions/config'

class ImportSettings extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showAlert: false
    }
  }

  render() {
    const { onSave, onCancel } = this
    const { showAlert, alertMessage, alertStyle } = this.state

    return (
      <Fragment>
        <ButtonGroup>
          <Button onClick={onSave}>Save</Button>
          <Button onClick={onCancel}>Settings</Button>
        </ButtonGroup>

        <form>
          <FormGroup controlId='showSettings'>
            <ControlLabel>settings</ControlLabel>
            <FormControl
              componentClass='textarea'
              inputRef={this.setSettingsRef}
              rows={10}
            />
            <HelpBlock>input settings and save</HelpBlock>
          </FormGroup>
        </form>
        {showAlert &&
          <Alert bsStyle={alertStyle}>
            {alertMessage}
          </Alert>
        }
      </Fragment>
    )
  }

  onSave = async () => {
    const settings = this.settingsElement.value
    // console.log('save, settings', settings)
    let showAlert = false, alertMessage = '', alertStyle = 'success'


    if (settings) {
      try {
        const settingsObject = JSON.parse(settings)

        const normalizedSettings = this.normalizeSettings(settingsObject)
        // console.log('onSave, normalizedSettings', normalizedSettings)

        await this.props.pushConfig(normalizedSettings)
        showAlert = true
        alertMessage = 'save done'
        alertStyle = 'success'
      } catch (err) {
        showAlert = true
        alertMessage = err.message
        alertStyle = 'warning'
      }
    } else {
      showAlert = true
      alertMessage = 'settings empty'
      alertStyle = 'warning'
    }

    this.setState({ showAlert, alertMessage, alertStyle })
  }

  onCancel = () => {
    const { history } = this.props
    history.replace('/settings', {})
  }

  /**
   * settings을 normalize함
   *
   * 1. add created property
   *
   * @param {*} settings
   */
  normalizeSettings(settings) {
    const created = Date.now()
    return Object.entries(settings).reduce((prev, [key, value]) => {
      // console.log('normalizeSettings', key, value)

      if (value && !value.created) value = Object.assign({}, value, { created })
      prev[key] = value
      return prev
    }, {})
  }

  setSettingsRef = (el) => {
    if (el) {
      // console.log('setSettingsRef', el)
      this.settingsElement = el
    }
  }
}

ImportSettings.propTypes = {
  config: PropTypes.object.isRequired
}

const mapStateToProps = ({ config: configState }) => {
  const { config } = configState

  return { config }
}

const mapDispatchToProps = {
  pushConfig
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ImportSettings))
