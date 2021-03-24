import {NetworkManager as Networking} from './Networking/networkmanager';
import {Blockchain} from './Blockchain/blockchain'
import {Block} from './Blockchain/block'
import {EventEmitter} from 'events'
import './Blockchain/miner'


const networkEvents = new EventEmitter();
const network = new Networking(networkEvents);

networkEvents.on('blocksReceived', (serializedBlocks)=>{
    console.log("\n\n$$$$$Blocks Received over network.");
    const blocksJSON = JSON.parse(serializedBlocks)
    const blocksArray: Block[] = []
    for(let i = 0; i < blocksJSON.length; i++){        
        const newBlock = Block.deserialize(blocksJSON[i])        
        blocksArray.push(Block.deserialize(blocksJSON[i]));
    }

    console.log("Blocks in array: ", blocksArray);    
    // }
    
    //TODO
    //If peer is longer
        //If peer doesn't align, request enter blockchain
        //else, add it
})

const blockchainEvents = new EventEmitter();
const blockchain = new Blockchain(blockchainEvents);
blockchainEvents.on('mined', ()=>{
    console.log("\n\n\n\nIndex.js::New block mined");
    network.sendSerializedBlocks(blockchain.getLast5BlocksJSON());    
})
blockchain.runMiningLoop();
