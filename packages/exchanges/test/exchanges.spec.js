/* global describe, it, before */

import chai from 'chai'
import { getSummary, exchanges, wallets } from '../lib/@cryptobalance/exchanges'

chai.expect()

const expect = chai.expect

let summary

describe('Given an instance of my Cat library', () => {
  before(async () => {
    summary = await getSummary({}, { usd: 1980 })
    console.log('summary', summary, 'exchanges', exchanges, 'wallets', wallets)
  })
  describe('when I need the name', () => {
    it('should return the name', () => {
      expect(summary).not.null()
    })
  })
})

