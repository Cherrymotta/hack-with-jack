require('dotenv').config();

const fs = require('fs');
const YAML = require('yaml');
const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');

const Vesting = require('./build/contracts/Vesting.json');
const Token = require('./build/contracts/MFToken.json');

const vestingAddress = process.env.VESTING_ADDRESS;
if (!vestingAddress || vestingAddress === '') throw new Error('Vesting address missing.');

let web3, provider, accounts, vesting, token, phases;

const loadContracts = async () => {
    accounts = await web3.eth.getAccounts();
    vesting = new web3.eth.Contract(Vesting.abi, vestingAddress);

    const tokenAddress = await vesting.methods.getToken().call();
    token = new web3.eth.Contract(Token.abi, tokenAddress);

    console.log('accounts[0]: ', accounts[0]);
    console.log('tokenAddress: ', tokenAddress);
};

const loadVestingPhases = () => {
    const data = fs.readFileSync('test/vesting.yml').toString();
    phases = YAML.parse(data);
    console.log("\x1b[1;34mRounds:\x1b[0m");
    console.log(phases);
};

const addPhase = async (phaseID, start, duration, cliff, cliffPercent, slice, phaseName) => {
    // Сначала заполняется расписание фазы
    const gas = await vesting.methods.createVestingPhase(phaseID, start, duration, cliff, cliffPercent, slice, phaseName).estimateGas({ from: accounts[0] });
    console.log('vesting phase gas: ', gas);
    await vesting.methods.createVestingPhase(
        phaseID,
        start,
        duration,
        cliff,
        cliffPercent,
        slice,
        phaseName
    ).send({from: accounts[0], gasLimit: 300000});
};

const addInvestor = async (investor, totalInvestorAmount, cliffPercent, phaseID) => {
    let amountAfterCliff = Math.round(totalInvestorAmount * cliffPercent / 1000);
    totalInvestorAmount = totalInvestorAmount - amountAfterCliff;

    totalInvestorAmount = web3.utils.toWei(String(totalInvestorAmount));
    amountAfterCliff = web3.utils.toWei(String(amountAfterCliff));

    const gas = await vesting.methods.addInvestor(investor, totalInvestorAmount, amountAfterCliff, phaseID).estimateGas({ from: accounts[0] });
    console.log('adding investor gas: ', gas);
    await vesting.methods.addInvestor(investor, totalInvestorAmount, amountAfterCliff, phaseID).send({from: accounts[0], gasLimit: 300000});
    console.log('added new investor: ' + investor + ' - ' + totalInvestorAmount + ' MFT');
};

const fill = async () => {
    // Fill vsting balance from a balance of token owner - accounts[0]
    const amount = web3.utils.toWei('170000000');
    await token.methods.transfer(vestingAddress, amount).send({ from: accounts[0] });
    const vestBalance = await token.methods.balanceOf(vestingAddress).call();
    const ownerBalance = await token.methods.balanceOf(accounts[0]).call();

    console.log('Vesting balance: ', BigInt(vestBalance));
    console.log('Owner balance: ', BigInt(ownerBalance));

    // Выдача роли корректировщика этапов вестинга для экаунта №1
    // const gasR = await vesting.methods.grantSARole(accounts[1]).estimateGas({ from: accounts[0] });
    // console.log('gasR: ', gasR);
    // await vesting.methods.grantSARole(accounts[1]).send({ from: accounts[0] });

    for (let phaseIndex in phases) {
        const phase = phases[phaseIndex];

        const roundName = phase.round_name,
              startDate = Math.round(Date.now() / 1000) + phase.starting_at * 60,
              cliffInterval = phase.cliff.delay * 60,
              cliffPercent = phase.cliff.percent * 10,
              sliceInterval = phase.slice.interval * 60;

        const roundDuration = sliceInterval * phase.slice.periods;

        await addPhase(phaseIndex + 1, startDate, roundDuration, cliffInterval, cliffPercent, sliceInterval, roundName);

        for (let investorIndex in phase.accounts) {
            const investor = phase.accounts[investorIndex];
            const { address, tokens } = investor;
            await addInvestor(address, tokens, cliffPercent, phaseIndex + 1);
        }
    };

    console.log('Done');
    process.kill(process.pid, 'SIGTERM');
};

(async () => {
    const provider = new Provider({
        privateKeys: [process.env.DEPLOYER_PRIVATE_KEY],
        providerOrUrl: `${ process.env.NETWORK_URL }:${ process.env.NETWORK_PORT }`
    });

    web3 = new Web3(provider);
    await loadContracts();
    loadVestingPhases();
    fill();
})();
