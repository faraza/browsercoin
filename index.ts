import {NetworkManager as Networking} from './Networking/networkmanager';
import {Blockchain} from './Blockchain/blockchain'
import {Block} from './Blockchain/block'
import {EventEmitter} from 'events'


const networkEvents = new EventEmitter();
const network = new Networking(networkEvents);

networkEvents.on('blockReceived', (serializedBlock)=>{
    const newBlock = Block.deserialize(serializedBlock)
    console.log("Index.js::New block received. Block num: ", newBlock.blockNum, " Miner: ", newBlock.minerPublicKey);
    if(blockchain.addBlockFromPeer(newBlock))
        console.log("!!! New block added over network !!!");
    else
        console.log("!!! New Block rejected from network !!!")
})

const blockchainEvents = new EventEmitter();
const blockchain = new Blockchain(blockchainEvents);
blockchainEvents.on('mined', (serializedBlock)=>{
    console.log("\n\n\n\nIndex.js::New block mined");
    network.sendSerializedBlock(serializedBlock);
})
blockchain.runMiningLoop();
