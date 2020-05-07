const RPCWebsockets = require('rpc-websockets').Client

const defaultOptions = {
  url: 'ws://localhost:11212',
  autoconnect: true,
  reconnect: true,
  reconnect_interval: 1000,
  max_reconnects: 0,
}

module.exports = class WalletApi {
  client = new RPCWebsockets(defaultOptions.url, { ...defaultOptions })

  _callApiMethod(methodName) {
    return params =>
      this.client
        .call(methodName, params)
  }


  async createDataRequest(params) {
    return this._callApiMethod('create_data_request')(params)
  }

  async updateWallet (params) {
    return this._callApiMethod('update_wallet')(params)
  }

  async createMnemonics(params) {
    return this._callApiMethod('create_mnemonics')(params)
  }

  async validateMnemonics(params) {
    return this._callApiMethod('validate_mnemonics')(params)
  }

  async createWallet(params) {
    return this._callApiMethod('create_wallet')(params)
  }

  async generateAddress(params) {
    return this._callApiMethod('generate_address')(params)
  }

  async getTransactions(params) {
    return this._callApiMethod('get_transactions')(params)
  }

  async getBalance(params) {
    return this._callApiMethod('get_balance')(params)
  }

  async getWalletInfos(params) {
    return this._callApiMethod('get_wallet_infos')(params)
  }

  async importSeed(params) {
    return this._callApiMethod('import_seed')(params)
  }

  async lockWallet(params) {
    return this._callApiMethod('lock_wallet')(params)
  }

  async runRadRequest(params) {
    return this._callApiMethod('run_rad_request')(params)
  }

  async sendDataRequest(params) {
    return this._callApiMethod('send_data_request')(params)
  }

  async createVTT(params) {
    const defaultParams = { time_lock: 0 }
    return this._callApiMethod('create_vtt')({ ...defaultParams, ...params })
  }

  async unlockWallet(params) {
    return this._callApiMethod('unlock_wallet')(params)
  }

  async closeSession(params) {
    return this._callApiMethod('close_session')(params)
  }

  getAddresses(params) {
    return this._callApiMethod('get_addresses')(params)
  }

  sendTransaction(params) {
    return this._callApiMethod('send_transaction')(params)
  }

  saveItem(params) {
    return this._callApiMethod('set')(params)
  }

  getItem(params) {
    return this._callApiMethod('get')(params)
  }
}
