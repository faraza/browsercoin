const Networking = require('./Networking/networkmanager');
const Blockchain = require('./Blockchain/blockchain')
const Block = require('./Blockchain/block')
const {EventEmitter} = require('events')


const networkEvents = new EventEmitter();
const network = new Networking(networkEvents);

networkEvents.on('blockReceived', (serializedBlock)=>{
    console.log("Block received. Raw text: ", serializedBlock)
    const newBlock = Block.deserialize(serializedBlock)
    console.log("Index.js::New block received. Block num: ", newBlock.blockNum, " Miner: ", newBlock.minerPublicKey);
})

const blockchainEvents = new EventEmitter();
const blockchain = new Blockchain(blockchainEvents);
blockchainEvents.on('mined', (serializedBlock)=>{
    console.log("\n\n\n\nIndex.js::New block mined");
    network.sendSerializedBlock(serializedBlock);
})
blockchain.runMiningLoop();
