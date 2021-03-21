"use strict";
exports.__esModule = true;
var networkmanager_1 = require("./Networking/networkmanager");
var blockchain_1 = require("./Blockchain/blockchain");
var block_1 = require("./Blockchain/block");
var events_1 = require("events");
require("./Blockchain/miner");
var networkEvents = new events_1.EventEmitter();
var network = new networkmanager_1.NetworkManager(networkEvents);
networkEvents.on('blockReceived', function (serializedBlock) {
    var newBlock = block_1.Block.deserialize(serializedBlock);
    console.log("Index.js::New block received. Block num: ", newBlock.blockNum, " Miner: ", newBlock.minerPublicKey);
    if (blockchain.addBlockFromPeer(newBlock))
        console.log("!!! New block added over network !!!");
    else
        console.log("!!! New Block rejected from network !!!");
});
var blockchainEvents = new events_1.EventEmitter();
var blockchain = new blockchain_1.Blockchain(blockchainEvents);
blockchainEvents.on('mined', function (serializedBlock) {
    console.log("\n\n\n\nIndex.js::New block mined");
    network.sendSerializedBlock(serializedBlock);
});
blockchain.runMiningLoop();
