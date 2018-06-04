
import request from 'request-promise'
import { wei2ether } from '../base'

const baseUrl = 'https://api.etherscan.io/api'

/**
 * api documentation - https://etherscan.io/apis
 *
 * create api key - https://etherscan.io/myapikey
 *
 * 1. get ether balance
 *   https://api.etherscan.io/api?module=account&action=balance&address=???&tag=latest&apikey=YourApiKeyToken
 *
  { "status":"1",
    "message":"OK",
    "result":"46287122000000000" // in wei
  }

 * 2. get a list of erc20 token transfer events
 *    http://api.etherscan.io/api?module=account&action=tokentx&address=???&startblock=0&endblock=999999999&sort=asc&apikey=???
 *
  { "status":"1",
    "message":"OK",
    "result":[{
      "blockNumber":"5579128",
      "timeStamp":"1525801724",
      "hash":"0xb74a4f753918bbdb47ba23b20e64d89cfd54b1355cbc8208bb6284be4a188075",
      "nonce":"2320035",
      "blockHash":"0x5f466178a09a093fa180105ad2b14244ec36cc658c4ce9f7546c1adb6859c9cc",
      "from":"0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be",
      "contractAddress":"0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0",
      "to":"0x8bd20d42fe9b099553d9a92fc2572edb4397c7f1",
      "value":"700000000000000000",
      "tokenName":"EOS",
      "tokenSymbol":"EOS",
      "tokenDecimal":"18",
      "transactionIndex":"17",
      "gas":"111558",
      "gasPrice":"50000000000",
      "gasUsed":"55779",
      "cumulativeGasUsed":"515563",
      "input":"0xa9059cbb0000000000000000000000008bd20d42fe9b099553d9a92fc2572edb4397c7f100000000000000000000000000000000000000000000000009b6e64a8ec60000",
      "confirmations":"383"
    }]
  }

 * @param {Object} config {
 *   apiKey,
 *   address
 * }
 * @return { eth: 123123, eos: ...}
 */
export async function balance(config) {
  // console.log('ethereum balance', config)

  const { address, apiKey } = config
// async function balance() {
  const [ ether, tokens ]  = await Promise.all([ request({
      url: baseUrl,
      qs: {
        module: 'account',
        action: 'balance',
        address,
        tag: 'latest',
        apikey: apiKey
      },
      method: 'GET',
      json: true
    }), request({
      url: baseUrl,
      qs: {
        module: 'account',
        action: 'tokentx',
        address,
        startblock: 0,
        endblock: 999999999,
        sort: 'asc',
        apikey: apiKey
      },
      method: 'GET',
      json: true
    })
  ])
  // console.log('ethereum wallets balance', ether, tokens)

  const result = {}

  const { result: etherBalance } = ether
  if (etherBalance) result.eth = Number(wei2ether(etherBalance))

  const { result: tokenTxList } = tokens
  if (tokenTxList) {
    tokenTxList.forEach(({ to, from, value, tokenSymbol }) => {
      if (to.toLowerCase() === address.toLowerCase()) {
        // increase token balance
        if (!result[tokenSymbol.toLowerCase()]) result[tokenSymbol.toLowerCase()] = 0
        result[tokenSymbol.toLowerCase()] += wei2ether(Number(value))
      } else if (from.toLowerCase() === address.toLowerCase()) {
        /// decrease token balance
        if (!result[tokenSymbol.toLowerCase()]) result[tokenSymbol.toLowerCase()] = 0
        result[tokenSymbol.toLowerCase()] -= wei2ether(Number(value))
      }
    })
  }

  // console.log('ethereum balance', result)

  return result
}
