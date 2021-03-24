import {NetworkManager as Networking} from './Networking/networkmanager';
import {Blockchain} from './Blockchain/blockchain'
import {Block} from './Blockchain/block'
import {EventEmitter} from 'events'
import './Blockchain/miner'


const networkEvents = new EventEmitter();
const network = new Networking(networkEvents);

networkEvents.on('blocksReceived', (serializedBlocks)=>{
    const blocksJSON = JSON.parse(serializedBlocks)
    const blocksArray: Block[] = []

    const lastBlock = Block.deserialize(blocksJSON[blocksJSON.length - 1])
    console.log("\n\n$$$$$Blocks Received over network. Network length: " + lastBlock.blockNum + 
    " My length: " + blockchain.blocks.length);

    for(let i = 0; i < blocksJSON.length; i++){        
        blocksArray.push(Block.deserialize(blocksJSON[i]));
    }

    if(blockchain.isPeerBlockchainLonger(blocksArray)){
        if(blockchain.doBlocksFitOnChain(blocksArray)){
            const success = blockchain.addTailFromPeer(blocksArray);
            console.log("Added block tail from network. Success: ", success)
            console.log(blocksArray)
        }
        else{
            //TODO: Request full block chain
        }
    }        
})

const blockchainEvents = new EventEmitter();
const blockchain = new Blockchain(blockchainEvents);
blockchainEvents.on('mined', ()=>{
    console.log("\n\n\n\nIndex.js::New block mined. Sending: ", blockchain.getLast5BlocksJSON());
    network.sendSerializedBlocks(blockchain.getLast5BlocksJSON());    
})
blockchain.runMiningLoop();
