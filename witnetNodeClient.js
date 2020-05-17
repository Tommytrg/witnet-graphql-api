// Include Nodejs' net module.
const Net = require('net');
// The port number and hostname of the server.
const port = 21338;
const host = 'localhost';

module.exports = class NodeApi {
  constructor() {
    this.client = new Net.Socket()
    this.client.connect({ port, host })
  }

  callApiMethod(methodName, params) {
    this.client.write(`{"jsonrpc":"2.0","id":"1","method":"${methodName}","params": ${params ? JSON.stringify(params) : JSON.stringify({})}}\n`);
    return new Promise((resolve, reject) => {
      let content = ''
      this.client.on('data', (chunk) => {
        content += chunk.toString()
        if (chunk.toString().includes('\n')) {
          return resolve(content)
        }
      })
    }).then(response => {
      return JSON.parse(response).result
    })
  }

  // Get the list of all the known block hashes.
  // params: { epoch: number, limit: number}
  getBlockchain(params) {
    return this.callApiMethod('getBlockChain', params)
  }

  // broadcast a transaction, block or error to the node like any other from the network
  inventory() { }

  // Get block by hash
  getBlock() { }

  // get transaction by hash
  getTransaction() { }

  // getNode status
  status() { }

  // get data request report
  dataRequestReport() { }

  // get balance of the node
  getBalance({ pkh }) {
    return this.callApiMethod('getBalance', { pkh })
  }

  // Get Reputation of one pkh
  getReputation(params) {
    return this.callApiMethod('getReputation', params)
  }

  // Get all reputation from all identities
  getReputationAll() {
    return this.callApiMethod('getReputationAll')
  }

  // get peers
  peers() {
    return this.callApiMethod('getPeers')
  }

  // get known peers
  knownPeers() {
    return this.callApiMethod('knownPeers')
  }

  // Build data request transaction
  sendRequest() { }

  // Build value transfer transaction
  sendValue() { }

  // Get public key
  getPublicKey() {
    return this.callApiMethod('getPublicKey')
  }

  // Get public key hash
  getPkh() {
    return this.callApiMethod('getPkh')
  }

  // sign data
  sign() { }

  // create vrf
  createVRF() { }

  // Export private key associated with the node identity
  masterKeyExport() { }
}

