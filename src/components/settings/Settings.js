
import React, { Fragment, Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Header from '../Header'
import { get, set, wallets, exchanges, STORAGE_KEY } from '../../actions/summary/storage'
import { Panel, Table, Button, ButtonGroup, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap'
import { withRouter, Link } from 'react-router-dom'
import CreateSettings from './CreateSettings'
import { connect } from 'react-redux'
import { pushConfig } from '../../actions/config'
import { FormattedMessage } from 'react-intl'

class Settings extends Component {
  constructor (props) {
    super(props)
  }

  render() {
    const { getNormalizedValue, onDelete, onUpdate, copySettingsToClipboard, settingsObject, setRef } = this
    const { config: cryptoPlaces } = this.props

    return (
      <Fragment>
        <ButtonGroup>
          <Button><Link to='/settings/create'><FormattedMessage id='settings.add'/></Link></Button>
          <Button><Link to='/settings/export'><FormattedMessage id='settings.export'/></Link></Button>
          <Button><Link to='/settings/import'><FormattedMessage id='settings.import'/></Link></Button>
        </ButtonGroup>

        {cryptoPlaces &&
          Object.entries(cryptoPlaces).map(([name, config]) => (
            <Panel bsStyle='primary'>
              <Panel.Heading>
                <Panel.Title componentClass='h3'>
                  {name}
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                <ButtonGroup>
                  <Button onClick={onUpdate.bind(this, name)}><FormattedMessage id='settings.update'/></Button>
                  <Button onClick={onDelete.bind(this, name)}><FormattedMessage id='settings.delete'/></Button>
                </ButtonGroup>
              </Panel.Body>
              {config &&
                <Table striped bordered condensed hover>
                  <tbody>
                    {Object.entries(config).map(([configName, configValue]) => (
                      <tr>
                        <td>{configName}</td>
                        <td>{getNormalizedValue(configName, configValue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              }
            </Panel>
          ))
        }

      </Fragment>
    )
  }

  getNormalizedValue = (name, value) => {
    if (name === 'password' || name === 'apiSecretKey') return '***'
    if (name === 'created') return new Date(value).toLocaleString()
    return value
  }

  onUpdate = (name) => {
    const { history } = this.props

    console.log('onUpdate name', name)

    history.push('/settings/create', { cryptoPlace: name })
  }

  /**
   * config에서 name을 삭제
   */
  onDelete = (name) => {
    console.log('onDelete name', name)

    const { config } = this.props
    const newConfig = Object.assign({}, config)
    delete newConfig[`${name}`]

    console.log('onDelete', newConfig)

    // save
    this.props.pushConfig(newConfig)
  }
}

Settings.propTypes = {
  config: PropTypes.object.isRequired
}

const mapStateToProps = ({ config: configState }) => {
  const { config } = configState

  return { config }
}

const mapDispatchToProps = {
  pushConfig
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Settings))
