require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

module.exports = {
  solidity: "0.8.0",
  networks: {
    // hardhat: {
    //   chainId: 31337
    // },

    goerli: {
      url: `${process.env.goerliURL}`,
      accounts: [`${process.env.PK}`],
    } 
  }
};