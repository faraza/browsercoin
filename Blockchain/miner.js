/**
 * Miner should be forked as a child process
 * otherwise it WILL block the main thread
 */

const Block = require('./block')

process.on('findNonce', (block) =>{    
    console.log("Miner.js::findNonce start");
    const nonce = block.findNonce();    
    console.log("Miner.js::findNonce found");
    process.send(nonce);
})