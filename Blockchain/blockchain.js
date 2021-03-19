const Block = require('./block')
const { fork } = require('child_process');

class Blockchain {    

    constructor(){        
        this.blocks = []
        this.myPublicKey = "myPublicKey1"
        this.blockReward = 50;
        this.numZeros = 5;
        this.currentBlock;

        this.miningWorker = fork('./miner'); 
        this.miningWorker.on('message', this.nonceFoundHandler.bind(this));
        this.miningStartTime;
    }

    //TODO: Fix this to work with worker thread
    testSerializingSingle(){
        this.blocks = [];
        this.mineLatestBlock();
        this.printLatestBlock();
        const serializedBlock = Block.serialize(this.blocks[0]);
        this.blocks[0] = Block.deserialize(serializedBlock);
        this.printLatestBlock();
        this.mineLatestBlock();
        this.printLatestBlock();
    }

    //TODO: Fix this to work with worker thread
    testSerializingMulti(numBlocks){
        this.blocks = [];
        for(let i = 0; i < numBlocks; i++){
            this.mineLatestBlock();
            this.printLatestBlock();
            const serializedBlock = Block.serialize(this.blocks[i]);
            this.blocks[i] = Block.deserialize(serializedBlock);
            this.printLatestBlock();
        }
    }

    runMiningLoop(){
        console.log("mining loop start");
        this.miningStartTime = new Date();
        const prevHash = (this.blocks.length === 0 ? 0 : this.blocks[this.blocks.length-1].getHash());
        this.currentBlock = new Block(this.blocks.length, this.myPublicKey, this.miningStartTime, this.blockReward, this.numZeros, prevHash);        
        console.log("run mining loop. ")
        this.miningWorker.send(this.currentBlock.serialize());
    }

    nonceFoundHandler(nonce){
        console.log("nonce found handler start. Nonce: " , nonce);
        this.currentBlock.setNonce(nonce);
        const blockWasValid = this.pushBlockToEndOfChain(this.currentBlock)        

        const miningEndTime = new Date();
        const totalMiningTime = miningEndTime - this.miningStartTime;
        if(blockWasValid)
            this.printLatestBlock();
        else{
            console.log("***ERROR - BLOCK WAS INVALID: " + this.currentBlock.toStringForPrinting());
        }
        console.log("*Block mining time: " + totalMiningTime);
        
        // this.miningWorker.kill();        
        this.runMiningLoop();
    }

    pushBlockToEndOfChain(block){
        if(!block.isMined()) return false;
        if(!block.confirmProofOfWork()) return false;

        if(this.blocks.length == 0){
            if(block.blockNum !== 0) return false;
            this.blocks.push(block);
            return true;
        }

        const prevBlock = this.blocks[this.blocks.length - 1];
        if(prevBlock.getHash() !== block.prevHash) return false;
        
        this.blocks.push(block);
    }

    printLatestBlock(){
        const latestBlock = this.blocks[this.blocks.length - 1]
        console.log("\n***New block mined! " + latestBlock.toStringForPrinting());
    }

    addBlockFromPeer(block){
        if(!this.isValidNewBlock(block)) return false;
        //TODO: Cancel current block mine
        //TODO: rewrite chain if other chain is longer        
        
        //TODO: implement
    }

    //TODO: Handle other blockchain being multiple blocks ahead

    isValidNewBlock(block){
        return true;
        //TODO: Refactor out from pushBlockToEndOfChain
    }



    getTotalWalletSize(){
        //TODO
    }
}

const bc = new Blockchain();
bc.runMiningLoop();

setInterval(()=>{
    console.log("Keeping this thing alive. Current array length: " + bc.blocks.length);
}, 1000);