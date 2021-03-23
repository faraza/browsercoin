"use strict";
exports.__esModule = true;
exports.Blockchain = void 0;
var block_1 = require("./block");
var fork = require('child_process').fork;
var randomInt = require('random-int');
var Blockchain = /** @class */ (function () {
    function Blockchain(eventEmitter) {
        this.blockReward = 50;
        this.numZeros = 2; //TODO: Make this dynamic. When there's a lot of miners, blocks will be mined too fast
        this.blocks = [];
        this.myPublicKey = "myPublicKey" + randomInt(10000);
        this.miningStartTime;
        this.eventEmitter = eventEmitter;
        console.log("*********BLOCKCHAIN PUBLIC KEY: ", this.myPublicKey);
    }
    /**
     * Returns less than 5 if the current blockchain is less than 5
     */
    Blockchain.prototype.getLast5Blocks = function () {
        var last5Blocks = [];
        var i = (this.blocks.length < 5) ? 0 : this.blocks.length - 5;
        while (i < this.blocks.length)
            last5Blocks.push(this.blocks[i++]);
        return last5Blocks;
    };
    /**
     * TODO: This will give an error if the method is not run from
     * the browsercoin working directory!
     */
    Blockchain.prototype.setupMiningWorker = function () {
        this.miningWorker = fork('./Blockchain/miner.js');
        this.miningWorker.on('message', this.nonceFoundHandler.bind(this));
    };
    Blockchain.prototype.runMiningLoop = function () {
        console.log("mining loop start");
        this.miningStartTime = new Date();
        var prevHash = (this.blocks.length === 0 ? "0" : this.blocks[this.blocks.length - 1].getHash());
        this.currentBlock = new block_1.Block({ blockNum: this.blocks.length, minerPublicKey: this.myPublicKey,
            timestamp: this.miningStartTime.toString(), blockReward: this.blockReward,
            numZeros: this.numZeros, prevHash: prevHash });
        console.log("run mining loop. ");
        this.setupMiningWorker();
        this.miningWorker.send(this.currentBlock.serialize());
    };
    Blockchain.prototype.nonceFoundHandler = function (nonce) {
        console.log("nonce found handler start. Nonce: ", nonce);
        this.currentBlock.setNonce(nonce);
        var blockWasValid = this.pushBlockToEndOfChain(this.currentBlock);
        var miningEndTime = new Date();
        var totalMiningTime = (miningEndTime - this.miningStartTime);
        if (blockWasValid) {
            this.eventEmitter.emit('mined');
        }
        else {
            console.log("***ERROR - BLOCK WAS INVALID: " + this.currentBlock.toStringForPrinting());
        }
        console.log("*Block mining time: " + totalMiningTime);
        this.killMiningWorker();
        this.runMiningLoop();
    };
    Blockchain.prototype.pushBlockToEndOfChain = function (block) {
        if (!this.isValidNewBlock(block))
            return false;
        this.blocks.push(block);
        return true;
    };
    Blockchain.prototype.printLatestBlock = function () {
        var latestBlock = this.blocks[this.blocks.length - 1];
        console.log("\n***New block mined! " + latestBlock.toStringForPrinting());
    };
    Blockchain.prototype.addBlockFromPeer = function (block) {
        if (!this.isValidNewBlock(block))
            return false;
        this.killMiningWorker();
        this.pushBlockToEndOfChain(block);
        this.runMiningLoop();
        return true;
    };
    //TODO: Handle other blockchain being multiple blocks ahead
    //Don't accept until the other block is 3 ahead of you
    Blockchain.prototype.isValidNewBlock = function (block) {
        if (!block.confirmProofOfWork())
            return false;
        if (block.blockNum !== this.blocks.length)
            return false;
        if (this.blocks.length == 0) {
            if (block.blockNum !== 0)
                return false;
            else
                return true;
        }
        var prevBlock = this.blocks[this.blocks.length - 1];
        if (prevBlock.getHash() !== block.prevHash)
            return false;
        return true;
    };
    Blockchain.prototype.killMiningWorker = function () {
        this.miningWorker.kill();
    };
    Blockchain.prototype.getTotalWalletSize = function () {
        //TODO
    };
    return Blockchain;
}());
exports.Blockchain = Blockchain;
