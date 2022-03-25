# Meta Fighter

![METAFIGHTER](./images/metafighter.jpg)

**install**

1. npm i

**deploy**

1. truffle compile
2. truffle migrate --reset --network development
   truffle deploy

**unit tests**

1. ganache-cli or others
2. truffle deploy
3. change parameters in .env file (DEPLOYER_PRIVATE_KEY, VESTING_ADDRESS, ...)
4. truffle test

**web tests**
Fill vesting contract with the data of the first phase (seed)
Addresses of investors and token amounts must be in file: "./test/SeedRound.txt"
In this format:
0xAB7577Db185fB097aA7821403D43c3e7608Ae1fe, 20000
0x6ed0F6c5512DD1565FeF35261da6200cd2011358, 30000
0x626dCeF4EbD839D88279e0495e749Bd15D41CF0E, 40000

1. node ./fillVesting.js

   -————————————————
