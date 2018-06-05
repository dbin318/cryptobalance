/* global describe, it, before */

import chai from 'chai'
import { getSummary, exchanges, wallets } from '../lib/@cryptobalance/exchanges'

chai.expect()

const expect = chai.expect

describe('summary', () => {
  describe('getSummary is not null', () => {
    it('should return the name', async () => {
      const summary = await getSummary({}, { usd: 1980 })
      console.log('summary', summary)
      expect(summary).to.not.be.undefined
    })
  })
})

