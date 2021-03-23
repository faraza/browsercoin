"use strict";
exports.__esModule = true;
var networkmanager_1 = require("./Networking/networkmanager");
var blockchain_1 = require("./Blockchain/blockchain");
var events_1 = require("events");
require("./Blockchain/miner");
var networkEvents = new events_1.EventEmitter();
var network = new networkmanager_1.NetworkManager(networkEvents);
networkEvents.on('blocksReceived', function (serializedBlocks) {
    console.log("$$$$$Blocks Received over network. Message: ", serializedBlocks);
    //TODO: Convert to 
});
var blockchainEvents = new events_1.EventEmitter();
var blockchain = new blockchain_1.Blockchain(blockchainEvents);
blockchainEvents.on('mined', function () {
    console.log("\n\n\n\nIndex.js::New block mined");
    network.sendSerializedBlocks(JSON.stringify(blockchain.getLast5Blocks()));
});
blockchain.runMiningLoop();
