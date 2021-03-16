const Block = require('./block')

class Blockchain {
    constructor(){        
        this.blocks = []
        this.myPublicKey = "myPublicKey1"
        this.blockReward = 50;
        this.numZeros = 4;
    }

    run(){        
        while(true){
            const startTime = new Date();
            this.mineLatestBlock()
            const endTime = new Date();            
            this.printLatestBlock();
            console.log("*Block mining time: " + (endTime - startTime));
        }
    }

    mineLatestBlock(blockNumber){
        const startTime = new Date();
        const prevHash = (this.blocks.length === 0 ? 0 : this.blocks[this.blocks.length-1].getHash());
        const block = new Block(this.blocks.length, this.myPublicKey, startTime, this.blockReward, this.numZeros, prevHash);        
        block.setNonce(block.findNonce());
        this.blocks.push(block);        
    }

    printLatestBlock(){
        const latestBlock = this.blocks[this.blocks.length - 1]
        console.log("***New block mined! " + latestBlock.toStringForPrinting());
    }

    getTotalWalletSize(){
        //TODO
    }
}

const blockchain = new Blockchain();
blockchain.run();