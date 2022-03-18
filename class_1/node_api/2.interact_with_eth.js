import {deploy, web3, provider} from "./1.basic_web3";

//get accounts generated from your BIP-39 phrase
const accounts = await web3.eth.getAccounts();

//18 digits integers
//web3.utils.fromWei("number of wei", "unity to convert")
//web3.utils.toWei("number of unit", "type of unit")

//show account eth balance (native token)
console.log(accounts[0], ":",  web3.utils.fromWei( await web3.eth.getBalance(accounts[0]) ) );
console.log(accounts[1], ":",  web3.utils.fromWei( await web3.eth.getBalance(accounts[1]) ) );

//send eth to another account
await web3.eth.sendTransaction({to:accounts[1], from:accounts[0], value:web3.utils.toWei("0.001", "ether")})

//check eth balance again
console.log(accounts[0], ":",  web3.utils.fromWei( await web3.eth.getBalance(accounts[0]) ) );
console.log(accounts[1], ":",  web3.utils.fromWei( await web3.eth.getBalance(accounts[1]) ) );