require("dotenv").config({ path: ".env" });
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  migrations_directory: process.env.MIGRATIONS_DIR,
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    mainnet: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNEMONIC,
          `https://mainnet.infura.io/v3/` + process.env.INFURA_KEY
        ),
      network_id: 1,
      gas: 10000000,
      gasPrice: 191000000000,
      confirmations: 1,
      timeoutBlocks: 200,
      skipDryRun: false,
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNEMONIC,
          `https://ropsten.infura.io/v3/` + process.env.INFURA_KEY
        ),
      network_id: 3,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNEMONIC,
          `https://rinkeby.infura.io/v3/` + process.env.INFURA_KEY
        ),
      network_id: 4,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    goerli: {
      provider: () => {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          "https://goerli.infura.io/v3/" + process.env.INFURA_KEY
        );
      },
      network_id: "5",
      gas: 4465030,
      gasPrice: 10000000000,
    },
    bnb: {
      provider: () => {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          "https://bsc-dataseed.binance.org/"
        );
      },
      network_id: "56",
      gas: 70000000,
      gasPrice: 8000000000,
    },
    bnb_testnet: {
      provider: () => new HDWalletProvider(
        process.env.MNEMONIC,
        "https://data-seed-prebsc-1-s1.binance.org:8545"
      ),
      network_id: "97",
      confirmations: 10,
      networkCheckTimeout: 1000000,
      timeoutBlocks: 1000,
      skipDryRun: true,
    },
    polygon: {
      provider: () => {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          "https://polygon-rpc.com"
        );
      },
      network_id: "137",
      gas: 10000000,
      gasPrice: 700000000000,
    },
    mumbai: {
      provider: () => {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          "https://matic-mumbai.chainstacklabs.com")
      },
      network_id: "80001",
    },
    avalanche: {
      provider: () => {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          "https://api.avax.network/ext/bc/C/rpc"
        );
      },
      network_id: "43114",
      gas: 8000000,
      gasPrice: 26000000000,
    },
    fuji: {
      provider: () => new HDWalletProvider(
        process.env.MNEMONIC,
        "https://api.avax-test.network/ext/bc/C/rpc"
      ),
      network_id: "43113",
    },
    oasis: {
      provider: () => {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          "https://emerald.oasis.dev/"
        );
      },
      network_id: 42262,
      gas: 4465030,
      gasPrice: 30000000000,
    },
    aurora: {
      provider: () => {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          "https://mainnet.aurora.dev"
        );
      },
      network_id: 1313161554,
    },
    aurora_testnet: {
      provider: () => {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          "https://testnet.aurora.dev"
        )
      },
      network_id: 0x4e454153,
      gas: 10000000,
      from: "0xC42e9476b0a458097087336e2395Dbf45B0BdC12", // public key
    },
    fantom: {
      provider: () => {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          "https://rpc.ftm.tools/"
        )
      },
      network_id: 250,
      gas: 8000000,
      gasPrice: 3000000000000,
      timeoutBlocks: 15000,
    },
    fantom_testnet: {
      provider: () => {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          "https://rpc.testnet.fantom.network/"
        )
      },
      network_id: 0xfa2,
      gas: 4465030,
      gasPrice: 300000000000,
    },
    celo: {
      provider: () => {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          "https://forno.celo.org"
        )
      },
      network_id: 42220,
    },    
    celo_alfajores_testnet: {
      provider: () => {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          "https://alfajores-forno.celo-testnet.org"
        )
      },
      network_id: 44787,
    },
  },

  compilers: {
    solc: {
      version: "0.8.4",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },

  plugins: ["@chainsafe/truffle-plugin-abigen", "truffle-plugin-verify"],

  api_keys: {
    etherscan: process.env.ETHERSCAN_KEY,
  },
};
