const test = require('ava')

const witnetNodeClient = require('../../witnetNodeClient')

test('getBlockchain without parameters', async t => {
    const client = new witnetNodeClient()

    const blockchain = await client.getBlockchain()
    
    t.is(typeof blockchain[0][0], 'number')
    t.is(typeof blockchain[0][1], 'string')
})

// TODO: How getBlockchain parameters work?
test('getBlockchain with parameters', async t => {
    const client = new witnetNodeClient()

    const blockchain = await client.getBlockchain({epoch: 1, number: 0})

    t.is(typeof blockchain[0][0], 'number')
    t.is(typeof blockchain[0][1], 'string')
})