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
    Blockchain.prototype.getLast5BlocksJSON = function () {
        var last5Blocks = [];
        var i = (this.blocks.length < 5) ? 0 : this.blocks.length - 5;
        while (i < this.blocks.length) {
            last5Blocks.push(JSON.stringify(this.blocks[i]));
            i++;
        }
        return JSON.stringify(last5Blocks);
    };
    /**
     * After receiving new blocks from a peer, check
     * if they can be added to the end of this chain and increase the chain
     * length.
     * If none of the blocks from the peer have a hash that attaches to this
     * chain, return false.
     * @param blocks
     * @returns
     */
    Blockchain.prototype.doBlocksFitOnChain = function (blocks) {
        if (!this.isPeerBlockchainLonger(blocks))
            return false;
        //TODO: Handle this blockchain is length 0 case. If it is, you must request full blockchain if you didn't get everything
        return true;
    };
    Blockchain.prototype.isPeerBlockchainLonger = function (peerTail) {
        var peerLength = peerTail[peerTail.length - 1].blockNum + 1;
        return (this.blocks.length < peerLength);
    };
    Blockchain.prototype.isPeerBlockchainConsistent = function (peerBlocks) {
        for (var prevBlockIndex = 0; prevBlockIndex < peerBlocks.length - 1; prevBlockIndex++) {
            var prevBlock = peerBlocks[prevBlockIndex];
            var nextBlock = peerBlocks[prevBlockIndex + 1];
            prevBlock.recalculateHash();
            if (nextBlock.prevHash != prevBlock.hash)
                return false;
        }
        return true;
    };
    Blockchain.prototype.addTailFromPeer = function (peerTail) {
        if (!this.isPeerBlockchainLonger(peerTail)) {
            console.log("AddTailFromPeer. Peer is too short");
            return false;
        }
        if (!this.isPeerBlockchainConsistent(peerTail)) {
            console.log("AddTailFromPeer. Peer is not consistent");
            return false;
        }
        if (peerTail[0].isGenesisBlock()) {
            this.killMiningWorker();
            this.blocks = peerTail;
            this.runMiningLoop();
            return true;
        }
        else {
            var startingIndex = 0;
            while (peerTail[0].prevHash != this.blocks[startingIndex++].getHash()) { //TODO: Handle divergent genesis blocks   
                if (startingIndex == this.blocks.length) {
                    console.log("ERROR -- blockchain.ts::addTailFromPeer. Starting index == blocks.length. Starting index: " +
                        startingIndex + "Blocks: ", this.blocks);
                    return false;
                }
            }
            this.killMiningWorker();
            for (var i = 0; i < peerTail.length; i++) {
                var peerBlock = peerTail[i];
                if (!this.isValidNewBlock(peerBlock)) {
                    console.log("ERROR -- blockchain.ts::addTailFromPeer. Peer block is invalid. Peer block: ", peerBlock, "\nCurrent chain:\n", this.blocks);
                    this.runMiningLoop();
                    return false;
                }
                this.blocks[startingIndex + i] = peerTail[i];
            }
            this.runMiningLoop();
            return true;
        }
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
        block.recalculateHash();
        this.blocks.push(block);
        return true;
    };
    Blockchain.prototype.printLatestBlock = function () {
        var latestBlock = this.blocks[this.blocks.length - 1];
        console.log("\n***New block mined! " + latestBlock.toStringForPrinting());
    };
    Blockchain.prototype.isValidNewBlock = function (block) {
        if (!block.confirmProofOfWork())
            return false;
        if (this.blocks.length == 0) {
            if (block.blockNum !== 0)
                return false;
            else
                return true;
        }
        var prevBlock = this.blocks[block.blockNum - 1];
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
