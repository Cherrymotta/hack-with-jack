import { web3, provider} from "./_basic_web3.js";

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contractPathERC20 = path.resolve(__dirname, './', 'BananaCoin.json');
const compiledERC20 = JSON.parse(fs.readFileSync(contractPathERC20, 'utf8'));

const accounts = await web3.eth.getAccounts();

//create smart contract object in web3.js
const tokenContractAddress = "0x59c7d11fB3B1ebE6B4c467279c851DFF225830D4";
const contractInstance = new web3.eth.Contract(
    compiledERC20.abi,
    tokenContractAddress
);

//check transactions on https://testnet.bscscan.com/token/0x59c7d11fb3b1ebe6b4c467279c851dff225830d4

//send calls to main methods
//read user balance
console.log("Token");
console.log(web3.utils.fromWei(await contractInstance.methods.balanceOf(accounts[0]).call(), "ether"));
console.log(web3.utils.fromWei(await contractInstance.methods.balanceOf(accounts[1]).call(), "ether"));
console.log("Ether");
console.log(accounts[0], ":",  web3.utils.fromWei( await web3.eth.getBalance(accounts[0]) ) );
console.log(accounts[1], ":",  web3.utils.fromWei( await web3.eth.getBalance(accounts[1]) ) );

//send tokens
await contractInstance.methods.transfer(accounts[1], web3.utils.toWei("10", "ether")).send({ gas: '1000000', from: accounts[0] });

//read user balance again
console.log("Token");
console.log(web3.utils.fromWei(await contractInstance.methods.balanceOf(accounts[0]).call(), "ether"));
console.log(web3.utils.fromWei(await contractInstance.methods.balanceOf(accounts[1]).call(), "ether"));
console.log("Ether");
console.log(accounts[0], ":",  web3.utils.fromWei( await web3.eth.getBalance(accounts[0]) ) );
console.log(accounts[1], ":",  web3.utils.fromWei( await web3.eth.getBalance(accounts[1]) ) );