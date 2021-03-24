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
    console.log("\n\n$$$$$Blocks Received over network.");
    var blocksJSON = JSON.parse(serializedBlocks);
    var blocksArray = [];
    for (var i = 0; i < blocksJSON.length; i++) {
        var newBlock = block_1.Block.deserialize(blocksJSON[i]);
        blocksArray.push(block_1.Block.deserialize(blocksJSON[i]));
    }
    console.log("Blocks in array: ", blocksArray);
    // }
    //TODO
    //If peer is longer
    //If peer doesn't align, request enter blockchain
    //else, add it
});
var blockchainEvents = new events_1.EventEmitter();
var blockchain = new blockchain_1.Blockchain(blockchainEvents);
blockchainEvents.on('mined', function () {
    console.log("\n\n\n\nIndex.js::New block mined");
    network.sendSerializedBlocks(blockchain.getLast5BlocksJSON());
});
blockchain.runMiningLoop();
