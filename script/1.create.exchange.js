
// javascript:  transact with deployed Uniswap Factory contract - createExchange

let Web3 = require("web3");
const Tx = require('ethereumjs-tx')

var abi = '[{"name":"NewExchange","inputs":[{"type":"address","name":"token","indexed":true},{"type":"address","name":"exchange","indexed":true}],"anonymous":false,"type":"event"},{"name":"initializeFactory","outputs":[],"inputs":[{"type":"address","name":"template"}],"constant":false,"payable":false,"type":"function","gas":35725},{"name":"createExchange","outputs":[{"type":"address","name":"out"}],"inputs":[{"type":"address","name":"token"}],"constant":false,"payable":false,"type":"function","gas":187911},{"name":"getExchange","outputs":[{"type":"address","name":"out"}],"inputs":[{"type":"address","name":"token"}],"constant":true,"payable":false,"type":"function","gas":715},{"name":"getToken","outputs":[{"type":"address","name":"out"}],"inputs":[{"type":"address","name":"exchange"}],"constant":true,"payable":false,"type":"function","gas":745},{"name":"getTokenWithId","outputs":[{"type":"address","name":"out"}],"inputs":[{"type":"uint256","name":"token_id"}],"constant":true,"payable":false,"type":"function","gas":736},{"name":"exchangeTemplate","outputs":[{"type":"address","name":"out"}],"inputs":[],"constant":true,"payable":false,"type":"function","gas":633},{"name":"tokenCount","outputs":[{"type":"uint256","name":"out"}],"inputs":[],"constant":true,"payable":false,"type":"function","gas":663}]'

let web3 = new Web3(new Web3.providers.HttpProvider(process.env.RINKEBY_INFURA));
// the account address that will send the test transaction
const addressFrom = process.env.METAMASK_ETH2
const privKey = process.env.METAMASK_PRIV2
// the Uniswap factory contract address
const addressTo = '0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36'
const contract = new web3.eth.Contract(JSON.parse(abi), addressTo);
const tx = contract.methods.createExchange(process.env.TOKEN_ADDRESS);
const encodedABI = tx.encodeABI();

function sendSigned(txData, cb) {
  const privateKey = new Buffer(privKey, 'hex')
  const transaction = new Tx(txData)
  transaction.sign(privateKey)
  const serializedTx = transaction.serialize().toString('hex')
  web3.eth.sendSignedTransaction('0x' + serializedTx, cb)
}
// get the number of transactions sent so far so we can create a fresh nonce
web3.eth.getTransactionCount(addressFrom).then(txCount => {
  // construct the transaction data
  const txData = {
    nonce: web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(6000000),
    gasPrice: web3.utils.toHex(10000000000),
    to: addressTo,
    from: addressFrom,
    data: encodedABI
  }
  // fire away!
  sendSigned(txData, function(err, result) {
    if (err) return console.log('error', err)
    console.log('sent', result)
  })
})
