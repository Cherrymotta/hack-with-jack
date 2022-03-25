const Vesting = require('./build/contracts/Vesting.json');
const Token = require('./build/contracts/MFToken.json');
const Web3 = require('web3');

const Provider = require('@truffle/hdwallet-provider');
const privateKey = 'bla bla bla...';
const provider = new Provider(privateKey, 'https://data-seed-prebsc-1-s1.binance.org:8545/'); 
const web3 = new Web3(provider);

const fs = require('fs');

const fill = async () => {
  
    // Подключение к контрактам
    const vestingAddress = '0xB7C8b69189FE46f0e7A625747858F3E96F823C61';
    const accounts = await web3.eth.getAccounts();
    const vesting = new web3.eth.Contract(Vesting.abi , vestingAddress)
    const tokenAddress = await vesting.methods.getToken().call();
    const token = new web3.eth.Contract(Token.abi , tokenAddress)
    // Пополнение баланса вестинга с баланса владельца токена - accounts[0]
    const amount = web3.utils.toWei('170000000');      
    await token.methods.transfer(vestingAddress, amount).send({ from: accounts[0] }); 
    const vestBalance = await token.methods.balanceOf(vestingAddress).call();
    const ownerBalance = await token.methods.balanceOf(accounts[0]).call();
    // Вывод инфы
    console.log('accounts[0]: ', accounts[0]);
    console.log('tokenAddress', tokenAddress);
    console.log('vesting balance: ', BigInt(vestBalance));
    console.log('owner balance: ', BigInt(ownerBalance));
    // Выдача роли корректировщика этапов вестинга для экаунта №1
    // const gasR = await vesting.methods.grantSARole(accounts[1]).estimateGas({ from: accounts[0] });
    // console.log('gasR: ', gasR);
    await vesting.methods.grantSARole(accounts[1]).send({ from: accounts[0] });
    // Заполнение этапов первой фазы вестинга
    const timeStampStart    = Math.round(Date.now() / 1000);
    console.log('timeStampStart', timeStampStart);
    const seedCliff         = 60*10;          // (10 min)
    const seedDuratin       = 60*5*12;        // (12 times for 5 min)
    const seedSlice         = 60*5;           // (5 min)
    // Фазу сида нужно разбить на 2 подэтапа: клиф и месячные выплаты
    let totalInvestorAmount;
    let amount1;
    let amount2;
    let investor;
    const seedRoundArray = fs.readFileSync('./test/SeedRound.txt').toString().split("\n");
    for(i in seedRoundArray) {
        investArray = seedRoundArray[i].split(", ");
        investor = investArray[0];
        totalInvestorAmount = parseInt(investArray[1]); 
        amount1 = Math.round(totalInvestorAmount * 0.05);
        amount2 = totalInvestorAmount - amount1;
        //
        // const gas = await vesting.methods.createVestingSchedule(true, investor, timeStampStart, seedCliff, timeStampStart + seedCliff, 1, amount1, 'SEED').estimateGas({ from: accounts[0] });
        // console.log('gas: ', gas);
        // Клиф 1 мес. и выплата 5%
        await vesting.methods.createVestingSchedule(
            true,           // revocable
            investor,       // investor
            timeStampStart, // start 
            seedCliff,      // clif 
            timeStampStart + seedCliff,    // duration 
            1,      // slice period                 
            amount1        
        ).send({ from: accounts[0], gasLimit: 300000});        
        console.log('new vesting for investor: ' + investor + ' - ' + amount1 + ' MFT');
        // // Месячные выплаты
        // await vesting.methods.createVestingSchedule(
        //     true,           
        //     investor,       
        //     timeStampStart + seedCliff,  // start 
        //     1,       // clif
        //     seedDuratin,   // duration  
        //     seedSlice,                       
        //     amount2,
        //     'SEED'         
        // ).send({ from: accounts[0], gasLimit: 300000});
        // console.log('new vesting for investor: ' + investor + ' - ' + amount2 + ' MFT');
    };  

}

fill();