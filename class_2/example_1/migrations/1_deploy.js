const Token = artifacts.require("MFToken");
const Vesting = artifacts.require("Vesting");

module.exports = async function (deployer, network, addresses) {

  console.log("Deploying contracts with the account:", deployer.address);

  await deployer.deploy(Token, "MetaFighter Token","MF");
  const token = await Token.deployed();
  console.log("Token address:", token.address);

  await deployer.deploy(Vesting, token.address);
  const vesting = await Vesting.deployed();
  console.log("Vesting address:", vesting.address);

};
