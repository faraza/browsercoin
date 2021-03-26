import {NetworkManager as Networking} from './Networking/networkmanager';
import {Blockchain} from './Blockchain/blockchain'
import {Block} from './Blockchain/block'
import {EventEmitter} from 'events'
import './Blockchain/miner'


const networkEvents = new EventEmitter();
const network = new Networking(networkEvents);

networkEvents.on('blocksReceived', (serializedBlocks, peer)=>{
    const blocksJSON = JSON.parse(serializedBlocks)
    const blocksArray: Block[] = []

    const lastBlock = Block.deserialize(blocksJSON[blocksJSON.length - 1])
    console.log("\n\n$$$$$Blocks Received over network. Network length: " + (lastBlock.blockNum+1) + 
    " My length: " + blockchain.blocks.length + " My blocks:\n", blockchain.blocks);

    for(let i = 0; i < blocksJSON.length; i++){        
        blocksArray.push(Block.deserialize(blocksJSON[i]));
    }

    if(blockchain.isPeerBlockchainLonger(blocksArray)){
        if(blockchain.doPeerBlocksFitOnChain(blocksArray)){
            const success = blockchain.addTailFromPeer(blocksArray);
            console.log("Added block tail from network. Success: ", success)
            console.log(blocksArray)
        }
        else{
            console.log("Peer blockchain is longer but it doesn't fit on this chain. Need to request full chain.")
            network.requestFullBlockchainFromPeer(peer)            
        }
    }        
})

networkEvents.on('fullBlockchainRequested', (peer)=>{
    network.sendFullBlockchainToPeer(blockchain.getFullBlockchainJSON(), peer);
})

const blockchainEvents = new EventEmitter();
const blockchain = new Blockchain(blockchainEvents);
blockchainEvents.on('mined', ()=>{
    console.log("******Block mined. Length: " + blockchain.blocks.length + " Blocks:\n", blockchain.blocks)
    network.sendSerializedBlocks(blockchain.getLast5BlocksJSON());    
})
blockchain.runMiningLoop();
