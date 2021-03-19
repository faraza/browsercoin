/**
 * Miner should be forked as a child process
 * otherwise it WILL block the main thread
 */

const Block = require('./block')

process.on('message', (serializedBlock) =>{    
    console.log("miner::start")
    const block = Block.deserialize(serializedBlock);    
    const nonce = block.findNonce();    
    console.log("Miner.js. Nonce: " + nonce)    
    process.send(nonce);
})