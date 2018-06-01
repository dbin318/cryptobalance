import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import { Panel, Table, Button, ButtonGroup, Form, FormGroup, Col, FormControl, ControlLabel, DropdownButton, MenuItem, Breadcrumb } from 'react-bootstrap'
import { injectIntl, FormattedMessage, intlShape } from 'react-intl'
import { pushConfig } from '../../actions/config'
import { connect } from 'react-redux'

class Settings extends Component {
  constructor(props) {
    super(props)

    this.currencies = ['USD', 'KRW']
  }

  render() {
    const { intl } = this.props
    const { formatMessage } = intl

    const languages = [{
      displayName: formatMessage({ id: 'settings.korean' }),
      value: 'ko',
    }, {
      displayName: formatMessage({ id: 'settings.english' }),
      value: 'en',
    }]
    const { currencies } = this

    const { onSelectLanguage, onSelectCurrency, onList } = this
    const { settings = {}} = this.props
    const { language = 'ko', currency = 'krw' } = settings

    return (
      <Fragment>
        <form>
          <FormGroup controlId='language'>
            <ControlLabel><FormattedMessage id='settings.language'/></ControlLabel>
            <FormControl
              componentClass='select'
              placeholder='select'
              onChange={onSelectLanguage}
              value={language}
            >
              {languages.map(({ displayName, value }) => (
                <option value={value}>{displayName}</option>
              ))}
            </FormControl>
          </FormGroup>
          <FormGroup controlId='currency'>
            <ControlLabel><FormattedMessage id='settings.currency'/></ControlLabel>
            <FormControl
              componentClass='select'
              placeholder='select'
              onChange={onSelectCurrency}
              value={currency}
            >
              {currencies.map(currency => (
                <option value={currency}>{currency}</option>
              ))}
            </FormControl>
          </FormGroup>
        </form>
      </Fragment>
    )
  }

  onSelectLanguage = async (event) => {
    const language = event.target.value

    console.log('onSelectLanguage', language)

    const { pushConfig, settings } = this.props

    await pushConfig({
      settings: Object.assign({}, settings, {
        language
      })
    })
  }

  onSelectCurrency = async (event) => {
    const currency = event.target.value

    console.log('onSelectCurrency', currency)

    const { pushConfig, settings } = this.props

    await pushConfig({
      settings: Object.assign({}, settings, {
        currency
      })
    })
  }
}

Settings.propTypes = {
  intl: intlShape.isRequired,
  settings: PropTypes.object.isRequired,
}

const mapDispatchToProps = {
  pushConfig
}

const mapStateToProps = ({ config: configState }) => {
  const { settings } = configState
  return { settings }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Settings))
