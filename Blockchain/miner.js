/**
 * Miner should be forked as a child process
 * otherwise it WILL block the main thread
 */

const Block = require('./block')

process.on('message', (block) =>{    
    console.log("Miner.js::findNonce start");
    // const nonce = block.findNonce();   
    const nonce = 100;
    console.log("Miner.js::findNonce found");
    process.send(nonce);
})