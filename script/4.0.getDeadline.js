let Web3 = require("web3");
//deadline = web3.eth.getBlock(web3.eth.blockNumber).timestamp
let web3 = new Web3(new Web3.providers.HttpProvider(process.env.RINKEBY_INFURA));

web3.eth.getBlockNumber().then(console.log);


deadline = web3.eth.getBlock(6986765).then(console.log);
// console.log('deadline:', deadline)