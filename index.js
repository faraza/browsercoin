"use strict";
exports.__esModule = true;
var networkmanager_1 = require("./Networking/networkmanager");
var blockchain_1 = require("./Blockchain/blockchain");
var block_1 = require("./Blockchain/block");
var events_1 = require("events");
require("./Blockchain/miner");
var networkEvents = new events_1.EventEmitter();
var network = new networkmanager_1.NetworkManager(networkEvents);
networkEvents.on('blocksReceived', function (serializedBlocks) {
    var blocksJSON = JSON.parse(serializedBlocks);
    var blocksArray = [];
    var lastBlock = block_1.Block.deserialize(blocksJSON[blocksJSON.length - 1]);
    console.log("\n\n$$$$$Blocks Received over network. Network length: " + lastBlock.blockNum +
        " My length: " + blockchain.blocks.length);
    for (var i = 0; i < blocksJSON.length; i++) {
        blocksArray.push(block_1.Block.deserialize(blocksJSON[i]));
    }
    if (blockchain.isPeerBlockchainLonger(blocksArray)) {
        if (blockchain.doBlocksFitOnChain(blocksArray)) {
            var success = blockchain.addTailFromPeer(blocksArray);
            console.log("Added block tail from network. Success: ", success);
            console.log(blocksArray);
        }
        else {
            //TODO: Request full block chain
        }
    }
});
var blockchainEvents = new events_1.EventEmitter();
var blockchain = new blockchain_1.Blockchain(blockchainEvents);
blockchainEvents.on('mined', function () {
    console.log("\n\n\n\nIndex.js::New block mined. Sending: ", blockchain.getLast5BlocksJSON());
    network.sendSerializedBlocks(blockchain.getLast5BlocksJSON());
});
blockchain.runMiningLoop();
