
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { PageHeader, ButtonGroup, Button, Navbar, Nav, NavItem } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

class Header extends Component {
  constructor(props) {
    super(props)

    this.state = {
      index: 1
    }
  }

  render() {

    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to='/'>cryptobalance (beta v0.1)</Link>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav bsStyle='pills' activeKey={this.state.index} onSelect={index => this.onChange(index)}>
          <NavItem eventKey={1}>
            <FormattedMessage id='header.balance' />
          </NavItem>
          <NavItem eventKey={2}>
            <FormattedMessage id='header.api' />
          </NavItem>
          <NavItem eventKey={3}>
            <FormattedMessage id='header.about' />
          </NavItem>
        </Nav>
      </Navbar>
    )
  }

  onChange = (index) => {
    // console.log('Header, Nav, selected index', index)

    const { history } = this.props
    this.setState({ index })

    switch(index) {
      case 1:
        history.push('/', {})
        break
      case 2:
        history.push('/api', {})
        break
      case 3:
        history.push('/about', {})
        break
    }
  }
}

export default withRouter(Header)
