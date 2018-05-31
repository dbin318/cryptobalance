
import React, { Fragment, Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Header from '../Header'
import { get, set, wallets, exchanges, STORAGE_KEY } from '../../actions/summary/storage'
import { Panel, Table, Button, ButtonGroup, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

class ExportApi extends Component {
  constructor (props) {
    super(props)

    const { config: cryptoPlaces } = this.props
    // console.log('ExportSettings cryptoPlaces', cryptoPlaces)

    this.settingsObject = JSON.stringify(cryptoPlaces, null, 2)
  }

  render() {
    return (
      <Fragment>
        <ButtonGroup>
          <Button><Link to='/api'><FormattedMessage id='api.list'/></Link></Button>
        </ButtonGroup>

        <form>
          <FormGroup controlId='showSettings'>
            <FormControl
              componentClass='textarea'
              inputRef={this.setSettingsRef}
              rows={10}
              value={this.settingsObject}
            />
            <HelpBlock>settings copied to clipboard</HelpBlock>
          </FormGroup>
        </form>
      </Fragment>
    )
  }

  // copy settings to clipboard
  setSettingsRef = (el) => {
    if (el) {
      // console.log('setSettingsRef', el)

      el.select()
      const successful = document.execCommand('copy')
      // console.log('copySettingsToClipboard', successful)
    }
  }
}

ExportApi.propTypes = {
  config: PropTypes.object.isRequired
}

const mapStateToProps = ({ config: configState }) => {
  const { config } = configState

  return { config }
}

export default withRouter(connect(mapStateToProps)(ExportApi))
