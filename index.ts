import {NetworkManager as Networking} from './Networking/networkmanager';
import {Blockchain} from './Blockchain/blockchain'
import {Block} from './Blockchain/block'
import {EventEmitter} from 'events'
import './Blockchain/miner'


const networkEvents = new EventEmitter();
const network = new Networking(networkEvents);

networkEvents.on('blocksReceived', (serializedBlocks)=>{
    console.log("$$$$$Blocks Received over network. Message: ", serializedBlocks);
    //TODO: Convert to 
})

const blockchainEvents = new EventEmitter();
const blockchain = new Blockchain(blockchainEvents);
blockchainEvents.on('mined', ()=>{
    console.log("\n\n\n\nIndex.js::New block mined");
    network.sendSerializedBlocks(JSON.stringify(blockchain.getLast5Blocks()));    
})
blockchain.runMiningLoop();
