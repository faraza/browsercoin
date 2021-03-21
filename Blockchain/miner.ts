/**
 * Miner should be forked as a child process
 * otherwise it WILL block the main thread
 */

 import {Block} from './block'

process.on('message', (serializedBlock) =>{    
    console.log("miner::start")
    const block = Block.deserialize(serializedBlock);    
    const nonce = block.findNonce()
        .then((nonce)=>process.send(nonce));    
})