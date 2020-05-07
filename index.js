const { ApolloServer, gql, UserInputError } = require('apollo-server');
const WalletApi = require('./witnetWallet')
const NodeApi = require('./witnetNodeClient')

// The GraphQL schema
const typeDefs = gql`
  type Query {
    walletInfos: [WalletInfo],
    wallet(password: String, id: String): Wallet
    node: Node
  }

  type Mutation {
    generateAddress(password: String, id: String): Address
    createMnemonics(length: Int): String
    validateMnemonics(mnemonics: String): Boolean
    validateSeed(seedData: String, seedSource: String): Boolean
    createWallet(name: String, caption: String, seedSource: String, seedData: String, password: String): WalletInfo
    updateWallet(walletId: String, sessionId: String, name: String, caption: String): Boolean
    lockWallet(sessionId: String, walletId: String): Boolean
    closeSession(sessionId: String, walletId: String): Boolean
  }

  type Node {
    blockchain: [BlockchainInfo]
    balance: String
    block: String
    pkh: String
    reputation: String
    transaction: String
  }

  type WalletInfo {
    caption: String,
    id: String,
    name: String,
  }

  type Wallet {
    id: String,
    addresses: [Address],
    # Unimplemented
    transactions: [String],
    balance: Balance
  }

  type Balance {
    locked: Int,
    available: Int,
    total: Int,
  }

  type Address {
    account: Int
    index: Int
    keychain: Int
    label: String
    path: String
    pkh: String
  }

  type BlockchainInfo {
    epoch: String,
    blockHash: String,
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    walletInfos: async (_parent, _args, { dataSources }) => {
      const result = await dataSources.walletApi.getWalletInfos()

      return result.infos
    },
    wallet: async (_parent, args, context) => {
      if (!args.password || !args.id) {
        return new UserInputError('password and id params are mandatory')
      }

      const walletId = args.id
      const unlockWalletRequest = await context.dataSources.walletApi.unlockWallet({ password: args.password, wallet_id: walletId, session_id: '1' })

      return {
        id: args.id,
        walletId,
        sessionId: unlockWalletRequest.session_id,
      }
    },
    node: async (_parent, args, { dataSources }) => {
      return {}
    },
  },
  Node: {
    pkh: async (_parent, _args, { dataSources }) => {
      const getPkhRequest = await dataSources.nodeApi.getPkh()

      return getPkhRequest
    },
    balance: async(_parent, _args, { dataSources }) => {
      const getPkhRequest = await dataSources.nodeApi.getPkh()
      const getBalanceRequest = await dataSources.nodeApi.getBalance({ pkh: getPkhRequest })

      return getBalanceRequest

    },
    blockchain: async(_parent, _args, { dataSources }) => {
      const getBlockchainRequest = await dataSources.nodeApi.getBlockchain()
      return JSON.parse(getBlockchainRequest).result.map(block => ({epoch: block[0], blockHash: block[1]}))
    },
  },
  Wallet: {
    addresses: async ({ walletId, sessionId }, _args, { dataSources }) => {
      const getAddressesRequest = await dataSources.walletApi.getAddresses({ wallet_id: walletId, session_id: sessionId })

      return getAddressesRequest.addresses
    },
    balance: async ({ walletId, sessionId }, _args, { dataSources }) => {
      const getBalanceRequest = await dataSources.walletApi.getBalance({ wallet_id: walletId, session_id: sessionId })

      return {
        available: getBalanceRequest.available,
        total: getBalanceRequest.total,
        unlocked: 0,
      }
    },
    transactions: async ({ walletId, sessionId }, _args, { dataSources }) => {
      const getTransactionsRequest = await dataSources.walletApi.getTransactions({ wallet_id: walletId, session_id: sessionId })

      // TODO: implement new transaction type
      return getTransactionsRequest.transactions
    }
  },
  Mutation: {
    createMnemonics: async(_parent, args, { dataSources }) => {
      const request = await dataSources.walletApi.createMnemonics({ length: args.length })

      return request.mnemonics
    },
    generateAddress: async(_parent, args, { dataSources }) => {
      const unlockWalletRequest = await dataSources.walletApi.unlockWallet({ password: args.password, wallet_id: args.id, session_id: '1' })
      const generateAddressRequest = await dataSources.walletApi.generateAddress({ password: args.password, wallet_id: args.id, session_id: unlockWalletRequest.session_id})
      return { pkh: generateAddressRequest.address, path: generateAddressRequest.path,
        account: null,
        index: null,
        keychain: null,
        label: null,
      }
    },

    validateSeed: async (_parent, args, { dataSources }) => {
      const request = await dataSources.walletApi.validateMnemonics({ seed_data: args.seedData, seed_source: args.seedSource })
      return request.valid
    },

    validateMnemonics: async (_parent, args, { dataSources }) => {
      const request = await dataSources.walletApi.validateMnemonics({ seed_data: args.mnemonics, seed_source: "mnemonics" })
      return request.valid
    },

    createWallet: async (_parent, args, { dataSources }) => {
      const request = await dataSources.walletApi.createWallet({ name: args.name, caption: args.caption, seedSource: args.seedSource, seedData: args.seedData, password: args.password })

      return request
    },

    updateWallet: async (_parent, args, { dataSources }) => {
      const request = await dataSources.walletApi.updateWallet({ session_id: args.sessionId, wallet_id: args.walletId, name: args.name, caption: args.caption })

      return request.succees
    },

    lockWallet: async (_parent, args, { dataSources }) => {
      const request = await dataSources.walletApi.lockWallet({ session_id: args.sessionId, wallet_id: args.walletId })

      return request.succees
    },

    closeSession: async(_parent, args, { dataSources }) => {
      const request = await dataSources.walletApi.closeSession({ sessionId: args.sessionId, walletId: args.walletId })
    }
  }
};

const walletApi = new WalletApi()
const nodeApi = new NodeApi()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    walletApi,
    nodeApi,
  }),
  tracing: true,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

