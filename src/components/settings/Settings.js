import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import { Panel, Table, Button, ButtonGroup, Form, FormGroup, Col, FormControl, ControlLabel, DropdownButton, MenuItem, Breadcrumb } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

class Settings extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const languages = ['korean', 'english']
    const currencies = ['USD', 'KRW']
    const { onSelectLanguage, onSelectCurrency, onList } = this

    return (
      <Fragment>
        <form>
          <FormGroup controlId='language'>
            <ControlLabel><FormattedMessage id='settings.language'/></ControlLabel>
            <FormControl
              componentClass='select'
              placeholder='select'
              onChange={onSelectLanguage}
              value={languages[0]}
            >
              {languages.map(language => (
                <option value={language}>{language}</option>
              ))}
            </FormControl>
          </FormGroup>
          <FormGroup controlId='currency'>
            <ControlLabel><FormattedMessage id='settings.currency'/></ControlLabel>
            <FormControl
              componentClass='select'
              placeholder='select'
              onChange={onSelectCurrency}
              value={currencies[0]}
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

}

export default Settings
