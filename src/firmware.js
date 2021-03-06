console.log('Init firmware of CoffeeChain')
var Web3 = require('web3')

var Gpio = require('onoff').Gpio
var rele = new Gpio(2, 'out')
rele.writeSync(0)

var provider = process.env.PROVIDER ? process.env.PROVIDER : 'localhost'
var contract = {
  address: '0xc5381302e07944c75e8a27f28Fab84300f49FE61',
  abi: '[{"constant": false, "inputs": [], "name": "kill", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": false, "inputs": [{"name": "addr", "type": "address"}], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [], "name": "counter", "outputs": [{"name": "", "type": "int256"}], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "_fee", "type": "uint256"}], "name": "setFee", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [], "name": "owner", "outputs": [{"name": "", "type": "address"}], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [], "name": "buy", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function"}, {"constant": true, "inputs": [], "name": "fee", "outputs": [{"name": "", "type": "uint256"}], "payable": false, "stateMutability": "view", "type": "function"}, {"inputs": [{"name": "_fee", "type": "uint256"}], "payable": false, "stateMutability": "nonpayable", "type": "constructor"}, {"anonymous": false, "inputs": [], "name": "OnCoffeeBought", "type": "event"}]'
}

var web3 = new Web3(new Web3.providers.HttpProvider('http://' + provider + ':8545'))

if (web3.isConnected()) {
  console.log('Provider ' + provider + ' is connected')
} else {
  console.log('Provider ' + provider + ' is offline')
  process.exit(1)
}

var CoffeeChain = web3.eth.contract(JSON.parse(contract.abi))
var coffeeChain = CoffeeChain.at(contract.address)

coffeeChain.fee(function (error, fee) {
  if (error) {
    console.log('Get Fee error: ', error)
  } else {
    console.log('Price of coffee is ' + web3.fromWei(fee, 'finney') + ' finney')
  }
})

coffeeChain.OnCoffeeBought().watch(function (error, result) {
  if (error) {
    console.log('On Coffee Bought error:', error)
  } else {
    console.log('Starting to make a coffee')
    var rele = new Gpio(2, 'out')
    rele.writeSync(1)
    setTimeout(function () {
      console.log('The coffee is ready')
      rele.writeSync(0)
    }, 45000)
  }
})
console.log('Start watch event OnCoffeeBought')

// Start reading from stdin so we don't exit.
process.stdin.resume()
