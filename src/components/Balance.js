
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Label, Table, Panel, ListGroup, ListGroupItem, Button, ButtonGroup, Breadcrumb } from 'react-bootstrap'
import { connect } from 'react-redux'
import { fetchSummary } from '../actions/summary'
import { exchanges, wallets } from '../actions/summary/storage'
import { BEGIN_SUMMARY, ERROR_SUMMARY } from '../actions/summary'
import { Link } from 'react-router-dom'
import { FormattedMessage, FormattedRelative, FormattedNumber, FormattedDate } from 'react-intl'

const cryptoPlaceNames = ['total'].concat(Object.keys(Object.assign({}, exchanges, wallets)))

class Balance extends Component {
  constructor (props) {
    super(props)
  }

  render() {
    const { summary: summaryState, fetchSummary, exchangeRate: exchangeRateState } = this.props
    const { type: summaryType, updated, summary } = summaryState
    const { exchangeRate: { date, usd } } = exchangeRateState
    // console.log('Balance render', exchangeRateState)

    const isSummaryEmpty = Boolean(!summary || Object.keys(summary).length === 0)
    console.log('Balance, summary', summaryType, updated, summary, date, usd)

    return (
      <Fragment>
        <ButtonGroup>
          <Button onClick={fetchSummary}>
            <FormattedMessage id='balance.refresh' />
          </Button>
        </ButtonGroup>

        {summaryType === BEGIN_SUMMARY &&
          <p>
            <FormattedMessage id='balance.loading'/>
          </p>
        }
        {summaryType === ERROR_SUMMARY &&
          <p>
            <FormattedMessage id='balance.loading-errors'/>
          </p>
        }
        {summaryType !== BEGIN_SUMMARY && summaryType !== ERROR_SUMMARY && isSummaryEmpty &&
          <Fragment>
            <h2><FormattedMessage id='balance.no-settings' /></h2>
            <Link to='/settings/create'><FormattedMessage id='balance.create-settings' /></Link>
          </Fragment>
        }

        {summaryType !== BEGIN_SUMMARY && summaryType !== ERROR_SUMMARY && !isSummaryEmpty &&
          <Fragment>
            <p/>
            <FormattedMessage id='balance.last-updated'/> : <FormattedRelative value={new Date(updated)}/>
            {date &&
              <p>  <FormattedMessage id='balance.exchange-rate' /> :
                <FormattedNumber value={usd} style='currency' currency='KRW'/>
                ( <FormattedDate value={date}/> )
              </p>
            }
            <Panel bsStyle='primary'>
              <Panel.Heading>
                <Panel.Title componentClass='h3'>
                  total
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                <FormattedNumber value={summary.total} style='currency' currency='KRW'/>
              </Panel.Body>
            </Panel>
            {Object.entries(summary)
              .sort(([currency1, cryptoPlaces1], [currency2, cryptoPlaces2]) => {
                const a = cryptoPlaces1 && cryptoPlaces1.total && cryptoPlaces1.total.price || 0
                const b = cryptoPlaces2 && cryptoPlaces2.total && cryptoPlaces2.total.price || 0
                return b - a
              })
              .map(([currency, cryptoPlaces]) => (
                currency !== 'total' &&
                  <Panel bsStyle='success'>
                    <Panel.Heading>
                      <Panel.Title componentClass='h3'>
                        {currency}
                      </Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                      {cryptoPlaces.total && cryptoPlaces.total.price &&
                        <FormattedNumber value={Math.round(cryptoPlaces.total.price * (cryptoPlaces.total.amount || 0))} style='currency' currency='KRW'/>
                      }
                    </Panel.Body>
                    <Table striped bordered condensed hover>
                      <tbody>
                        {this.sortByAmount(Object.entries(cryptoPlaces)).map(([cryptoPlaceName, { amount, price }]) =>
                          <tr>
                            <td>{cryptoPlaceName}</td>
                            <td>{amount || 0}</td>
                            <td>
                              {price &&
                                <FormattedNumber value={Math.round(price)} style='currency' currency='KRW'/>
                              }
                            </td>
                            <td>
                              {price &&
                                <FormattedNumber value={Math.round(price * (amount || 0))} style='currency' currency='KRW'/>
                              }
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </Panel>
              ))
            }
          </Fragment>
        }
      </Fragment>
    )
  }

  /**
   * sort by amount
   *
   * @param {Array} [[exchangeName, { amount, price }], ...]
   * @return {Array} sorted array
   */
  sortByAmount(items) {
    // console.log('sortByAmount', items)

    return items.sort((
      [ exchangeName1, { amount: amount1, price: price1 } ],
      [ exchangeName2, { amount: amount2, price: price2 } ]) => {
        if (exchangeName1 === 'total') return -1
        if (exchangeName2 === 'total') return 1
        return amount2 - amount1
      }
    )
  }
}

Balance.propTypes = {
  summary: PropTypes.object.isRequired
}

const mapStateToProps = ({ summary, exchangeRate }) => {
  return { summary, exchangeRate }
}

const mapDispatchToProps = {
  fetchSummary
}

export default connect(mapStateToProps, mapDispatchToProps)(Balance)
