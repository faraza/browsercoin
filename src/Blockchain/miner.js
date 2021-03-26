"use strict";
/**
 * Miner should be forked as a child process
 * otherwise it WILL block the main thread
 */
exports.__esModule = true;
var block_1 = require("./block");
onmessage = function (serializedBlock) {
    console.log('Miner.js -- received message from main');
    var block = block_1.Block.deserialize(serializedBlock);
    var nonce = block.findNonce()
        .then(function (nonce) { return postMessage(nonce, '*'); });
};
