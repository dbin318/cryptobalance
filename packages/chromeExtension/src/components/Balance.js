
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Label, Table, Panel, ListGroup, ListGroupItem, Button, ButtonGroup, Breadcrumb } from 'react-bootstrap'
import { connect } from 'react-redux'
import { fetchSummary } from '../actions/summary'
import { exchanges, wallets } from '@cryptobalance/exchanges'
import { BEGIN_SUMMARY, ERROR_SUMMARY } from '../actions/summary'
import { Link } from 'react-router-dom'
import { FormattedMessage, FormattedRelative, FormattedNumber, FormattedDate } from 'react-intl'

const cryptoPlaceNames = ['total'].concat(Object.keys(Object.assign({}, exchanges, wallets)))

class Balance extends Component {
  constructor (props) {
    super(props)
  }

  render() {
    const { summary: summaryState, fetchSummary, exchangeRate: exchangeRateState, config: configState } = this.props
    const { type: summaryType, updated, summary = {} } = summaryState
    const { exchangeRate: { date, usd } } = exchangeRateState
    const { settings: { currency: balanceCurrency = 'krw' }  } = configState
    console.log('Balance render, configState', configState)

    const isSummaryEmpty = Boolean(!summary || Object.keys(summary).length === 0)
    console.log('Balance, summary', summaryType, updated, summary, date, usd, balanceCurrency)

    const sortedBalance = Object.entries(summary)
      .sort(([currency1, cryptoPlaces1], [currency2, cryptoPlaces2]) => {
        const a = cryptoPlaces1 && cryptoPlaces1.total && (cryptoPlaces1.total.price * (cryptoPlaces1.total.amount || 0)) || 0
        const b = cryptoPlaces2 && cryptoPlaces2.total && (cryptoPlaces2.total.price * (cryptoPlaces2.total.amount || 0)) || 0
        return b - a
      })

    const { getCurrencyValue, sortByAmount } = this

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
            <h2><FormattedMessage id='balance.no-api' /></h2>
            <Link to='/api/create'><FormattedMessage id='balance.create-api' /></Link>
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
                  <FormattedMessage id='balance.total'/>
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                <FormattedNumber value={getCurrencyValue(summary.total, balanceCurrency, usd)} style='currency' currency={balanceCurrency}/>
              </Panel.Body>
            </Panel>
            {sortedBalance.map(([currency, cryptoPlaces]) => (
              currency !== 'total' &&
                <Panel bsStyle='success'>
                  <Panel.Heading>
                    <Panel.Title componentClass='h3'>
                      {currency}
                    </Panel.Title>
                  </Panel.Heading>
                  <Panel.Body>
                    {cryptoPlaces.total && cryptoPlaces.total.price &&
                      <FormattedNumber value={getCurrencyValue(cryptoPlaces.total.price * (cryptoPlaces.total.amount || 0), balanceCurrency, usd )} style='currency' currency={balanceCurrency}/>
                    }
                  </Panel.Body>
                  <Table striped bordered condensed hover>
                    <tbody>
                      {sortByAmount(Object.entries(cryptoPlaces)).map(([cryptoPlaceName, { amount, price }]) =>
                        <tr>
                          <td>{cryptoPlaceName}</td>
                          <td><FormattedNumber value={amount || 0} maximumFractionDigits={18} /></td>
                          <td>
                            {price &&
                              <FormattedNumber value={getCurrencyValue(price, balanceCurrency, usd)} style='currency' currency={balanceCurrency}/>
                            }
                          </td>
                          <td>
                            {price &&
                              <FormattedNumber value={getCurrencyValue(price * (amount || 0), balanceCurrency, usd)} style='currency' currency={balanceCurrency}/>
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
   * value is krw.
   * if currency is other than krw, then calculate value with respect to the exchange rate.
   *
   * @param krw
   * @param currency USD or KRW
   * @param exchange rate if currency === 'usd'
   * @return
   */
  getCurrencyValue = (krw, currency, usd) => {
    if (currency === 'USD' || currency === 'usd') return Math.round(krw / usd)
    return Math.round(krw)
  }

  /**
   * sort by amount
   *
   * @param {Array} [[exchangeName, { amount, price }], ...]
   * @return {Array} sorted array
   */
  sortByAmount = (items) => {
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
  summary: PropTypes.object.isRequired,
  exchangeRate: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
}

const mapStateToProps = ({ summary, exchangeRate, config }) => {
  return { summary, exchangeRate, config }
}

const mapDispatchToProps = {
  fetchSummary
}

export default connect(mapStateToProps, mapDispatchToProps)(Balance)
