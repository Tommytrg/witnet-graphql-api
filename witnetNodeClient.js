// Include Nodejs' net module.
const Net = require('net');
// The port number and hostname of the server.
const port = 21338;
const host = 'localhost';

// https://github.com/witnet/witnet-rust/blob/master/node/src/actors/json_rpc/json_rpc_methods.rs

// Create a new TCP client.
// const client = new Net.Socket();

// // Send a connection request to the server.
// client.connect({ port: port, host: host }, function () {
//   // If there is no error, the server has accepted the request and created a new
//   // socket dedicated to us.
//   console.log('TCP connection established with the server.');

//   // The client can now send data to the server by writing to its socket.
//   // client.write(`{"jsonrpc":"2.0","id":"1","method":"dataRequestReport","params":["54e9733837ad9c4625632fb936ccb772b7eea468337d4569336d77c9f38d2277"]}\n`);
//   client.write(`{"jsonrpc":"2.0","id":"1","method":"getBlockChain","params":[]}\n`);
// })

// // The client can also receive data from the server by reading from its socket.
// client.on('data', function (chunk) {
//   chunk.toString()

//   // Request an end to the connection after the data has been received.
//   // client.end();
// });

// client.on('end', function () {
//   console.log('Requested an end to the TCP connection');
// });


class NodeApi {
  constructor() {
    this.client = new Net.Socket()
    this.client.connect({ port, host })
  }

  callApiMethod (methodName, params = []){
    console.log('x')
    this.client.write(`{"jsonrpc":"2.0","id":"1","method":"${methodName}","params":[${params}]}\n`);

    return new Promise((resolve, reject) => {
      console.log('here')
      this.client.on('data', (chunk) => {
        resolve(chunk.toString())
      })
    })
  }

  getBlockchain() {
    return this.callApiMethod('getBlockChain')
  }

  inventory () { }

  getBlock () { }

  getTransaction() { }

  status() { }

  dataRequestReport() { }

  getBalance () { }

  getReputation () { }

  getReputationAll () { }

  peers () { }

  knownPeers () { }

  sendRequest () { }

  sendValue () { }

  getPublicKey () { }

  getPkh() { }

  sign() { }

  createVRF() { }

  masterKeyExport() { }
}


const a = new NodeApi()

a.getBlockchain().then(x => console.log(x))
