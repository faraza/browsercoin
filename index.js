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
    console.log("\n\n$$$$$Blocks Received over network. Network length: " + (lastBlock.blockNum + 1) +
        " My length: " + blockchain.blocks.length + " My blocks:\n", blockchain.blocks);
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
            console.log("Peer blockchain is longer but it doesn't fit on this chain. Need to request full chain.");
            //TODO: Request full block chain
        }
    }
});
var blockchainEvents = new events_1.EventEmitter();
var blockchain = new blockchain_1.Blockchain(blockchainEvents);
blockchainEvents.on('mined', function () {
    console.log("******Block mined. Length: " + blockchain.blocks.length + " Blocks:\n", blockchain.blocks);
    network.sendSerializedBlocks(blockchain.getLast5BlocksJSON());
});
blockchain.runMiningLoop();
