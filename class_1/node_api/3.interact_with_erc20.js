import {deploy, web3, provider} from "./1.basic_web3";

//create smart contract object in web3.js
const tokenContractAddress = "0x59c7d11fB3B1ebE6B4c467279c851DFF225830D4";
const contractInstance = new web3.eth.Contract(
    compiledERC20.abi,
    tokenContractAddress
);

//check transactions on https://testnet.bscscan.com/token/0x59c7d11fb3b1ebe6b4c467279c851dff225830d4

//send calls to main methods
//read user balance
console.log(web3.utils.fromWei(await contractInstance.methods.balanceOf(accounts[0]).call(), "ether"));
console.log(web3.utils.fromWei(await contractInstance.methods.balanceOf(accounts[1]).call(), "ether"));

//send tokens
await contractInstance.methods.transfer(accounts[1], web3.utils.toWei("10", "ether")).send({ gas: '1000000', from: accounts[0] });

//read user balance again
console.log(web3.utils.fromWei(await contractInstance.methods.balanceOf(accounts[0]).call(), "ether"));
console.log(web3.utils.fromWei(await contractInstance.methods.balanceOf(accounts[1]).call(), "ether"));