const Block = require('./block')
const { fork } = require('child_process');
const {EventEmitter} = require('events')
const randomInt = require('random-int');

module.exports = class Blockchain {    

    constructor(eventEmitter){        
        this.blocks = []
        this.myPublicKey = "myPublicKey" + randomInt(10000);
        this.blockReward = 50;
        this.numZeros = 3;
        this.currentBlock;

        this.miningStartTime;
        this.eventEmitter = eventEmitter;
        console.log("*********BLOCKCHAIN PUBLIC KEY: ", this.myPublicKey);
    }

    /**
     * TODO: This will give an error if the method is not run from
     * the browsercoin working directory!
     */
    setupMiningWorker(){
        this.miningWorker = fork('./Blockchain/miner'); 
        this.miningWorker.on('message', this.nonceFoundHandler.bind(this));
    }

    runMiningLoop(){
        console.log("mining loop start");
        this.miningStartTime = new Date();
        const prevHash = (this.blocks.length === 0 ? 0 : this.blocks[this.blocks.length-1].getHash());
        this.currentBlock = new Block(this.blocks.length, this.myPublicKey, this.miningStartTime, this.blockReward, this.numZeros, prevHash);        
        console.log("run mining loop. ")
        this.setupMiningWorker();
        this.miningWorker.send(this.currentBlock.serialize());
    }

    nonceFoundHandler(nonce){
        console.log("nonce found handler start. Nonce: " , nonce);
        this.currentBlock.setNonce(nonce);
        const blockWasValid = this.pushBlockToEndOfChain(this.currentBlock)        

        const miningEndTime = new Date();
        const totalMiningTime = miningEndTime - this.miningStartTime;
        if(blockWasValid){
            // this.printLatestBlock();   
            this.eventEmitter.emit('mined', this.currentBlock.serialize());
        }
        else{
            console.log("***ERROR - BLOCK WAS INVALID: " + this.currentBlock.toStringForPrinting());
        }
        console.log("*Block mining time: " + totalMiningTime);
        
        this.killMiningWorker();
        this.runMiningLoop();
    }

    pushBlockToEndOfChain(block){
        if(!this.isValidNewBlock(block)) return false;
        
        this.blocks.push(block);
        return true;
    }

    printLatestBlock(){
        const latestBlock = this.blocks[this.blocks.length - 1]
        console.log("\n***New block mined! " + latestBlock.toStringForPrinting());
    }

    addBlockFromPeer(block){
        if(!this.isValidNewBlock(block)) return false;
        this.killMiningWorker();
        this.pushBlockToEndOfChain(block) 
        this.runMiningLoop();
        return true;       
    }

    //TODO: Handle other blockchain being multiple blocks ahead
        //Don't accept until the other block is 3 ahead of you

    isValidNewBlock(block){
        if(!block.isMined()) return false;
        if(!block.confirmProofOfWork()) return false; 
        if(!block.blockNum == this.blocks.length) return false;

        if(this.blocks.length == 0){
            if(block.blockNum !== 0) return false;            
            else return true;
        }

        const prevBlock = this.blocks[this.blocks.length - 1];
        if(prevBlock.getHash() !== block.prevHash) return false;
                
        return true;        
    }

    killMiningWorker(){
        this.miningWorker.kill();        
    }


    getTotalWalletSize(){
        //TODO
    }
}