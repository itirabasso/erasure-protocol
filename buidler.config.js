usePlugin('buidler-erasure')

// task("compile", async () => {
//   console.log('no compile')
// });

const customSetup = require('./config/custom.config')
// deploySetup = require("./src/deploy.config");
// localSetup = require("./src/local.config");
mainnetSetup = require('./config/mainnet.config')
rinkebySetup = require('./config/rinkeby.config')

module.exports = {
  paths: {
    cache: 'packages/testenv/cache',
    artifacts: 'packages/testenv/build',
    sources: './contracts',
  },
  solc: {
    evmVersion: 'constantinople',
    version: '0.5.13',
  },
  networks: {
    // buidlerevm: {
    // erasureSetup: customSetup
    // },
    develop: {
      url: 'http://127.0.0.1:8545',
      accounts: {
        mnemonic:
          'myth like bonus scare over problem client lizard pioneer submit female collect',
        path: "m/44'/60'/0'/0/",
        initialIndex: 0,
        count: 20,
      },
    },
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/59d7e2fc73234fb89300603dc531c877',
      accounts: [
        // array of private key 
      ],
      erasureSetup: rinkebySetup,
    },
    mainnet: {
      url: 'http://127.0.0.1:8545',
    },
  },
}
