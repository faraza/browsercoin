/**
 * Miner should be forked as a child process
 * otherwise it WILL block the main thread
 */

 import {Block} from './block'

onmessage = function(serializedBlock){    
    console.log('Miner.js -- received message from main')
    const block = Block.deserialize(serializedBlock as unknown as string);
    const nonce = block.findNonce()
        .then((nonce)=>postMessage(nonce, '*'));
}