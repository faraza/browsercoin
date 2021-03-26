"use strict";
/**
 * Miner should be forked as a child process
 * otherwise it WILL block the main thread
 */
exports.__esModule = true;
var block_1 = require("./block");
process.on('message', function (serializedBlock) {
    console.log("miner::start");
    var block = block_1.Block.deserialize(serializedBlock);
    var nonce = block.findNonce()
        .then(function (nonce) { return process.send(nonce); });
});
