const Networking = require('./Networking/networkmanager');
const Blockchain = require('./Blockchain/blockchain')
const {EventEmitter} = require('events')


const networkEvents = new EventEmitter();
const network = new Networking(networkEvents);
networkEvents.on('newBlock', ()=>{
    console.log("Index.js::New block received");
})

const blockchainEvents = new EventEmitter();
const blockchain = new Blockchain(blockchainEvents);
blockchainEvents.on('mined', ()=>{
    console.log("Index.js::New block mined");
})
blockchain.runMiningLoop();

function newBlockMined(){
    //TODO
}

function newBlockReceived(){
    //TODO
}