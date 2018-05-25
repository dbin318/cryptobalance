
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Label, Table, Panel, ListGroup, ListGroupItem, Button, ButtonGroup, Breadcrumb } from 'react-bootstrap'
import { connect } from 'react-redux'
import { fetchSummary } from '../actions/summary'
import { exchanges, wallets } from '../actions/summary/storage'
import { BEGIN_SUMMARY, ERROR_SUMMARY } from '../actions/summary'
import { Link } from 'react-router-dom'

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
          <Button onClick={fetchSummary}>갱신</Button>
        </ButtonGroup>

        {summaryType === BEGIN_SUMMARY &&
          <div>
            loading...
          </div>
        }
        {summaryType === ERROR_SUMMARY &&
          <div>
            loading errors
          </div>
        }
        {summaryType !== BEGIN_SUMMARY && summaryType !== ERROR_SUMMARY && isSummaryEmpty &&
          <Fragment>
            <h2>설정된 연결 정보가 없습니다. </h2>
            <Link to='/settings/create'>설정 추가</Link>
          </Fragment>
        }

        {summaryType !== BEGIN_SUMMARY && summaryType !== ERROR_SUMMARY && !isSummaryEmpty &&
          <Fragment>
            <p/>
            last updated : {new Date(updated).toLocaleString()}
            {date &&
              <p> exchange rate : {parseInt(usd).toLocaleString()}원 ( {`${date.substring(0, 4)}.${date.substring(4,6)}.${date.substring(6,8)}`} )</p>
            }
            <Panel bsStyle='primary'>
              <Panel.Heading>
                <Panel.Title componentClass='h3'>
                  total
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                {parseInt(summary.total).toLocaleString()}원
              </Panel.Body>
            </Panel>
            {Object.entries(summary)
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
                        `${Math.round(cryptoPlaces.total.price * (cryptoPlaces.total.amount || 0)).toLocaleString()}원`
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
                                `${Math.round(price).toLocaleString()}원`
                              }
                            </td>
                            <td>
                              {price &&
                                `${Math.round(price * (amount || 0)).toLocaleString()}원`
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
