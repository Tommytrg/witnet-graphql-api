const { ApolloServer, gql, UserInputError } = require('apollo-server');
const WalletApi = require('./witnetWallet')

// The GraphQL schema
const typeDefs = gql`
  type Query {
    walletInfos: [WalletInfo],
    wallet(password: String, id: String): Wallet
    node: Node
  }

  type Node {
    blockchain: String
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
  }
};

const walletApi = new WalletApi()
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    walletApi: walletApi
  }),
  tracing: true,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

