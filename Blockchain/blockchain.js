const Block = require('./block')

class Blockchain {
    currentBlock;

    constructor(){        
        this.blocks = []
        this.myPublicKey = "myPublicKey1"
        this.blockReward = 50;
        this.numZeros = 6;
    }

    async run(){        
        while(true){
            const startTime = new Date(); 
            await this.mineLatestBlock()            
            const endTime = new Date();            
            this.printLatestBlock();
            console.log("*Block mining time: " + (endTime - startTime));
        }
    }

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

    async mineLatestBlock(){
        const startTime = new Date();
        const prevHash = (this.blocks.length === 0 ? 0 : this.blocks[this.blocks.length-1].getHash());
        this.currentBlock = new Block(this.blocks.length, this.myPublicKey, startTime, this.blockReward, this.numZeros, prevHash);        
        await this.currentBlock.findNonce().then((nonce)=>{            
            this.currentBlock.setNonce(nonce);
            this.blocks.push(this.currentBlock);            
        })         
    }    

    printLatestBlock(){
        const latestBlock = this.blocks[this.blocks.length - 1]
        console.log("\n***New block mined! " + latestBlock.toStringForPrinting());
    }

    addBlockFromPeer(block){
        if(!this.isValidNewBlock(block)) return false;
        //TODO: rewrite chain if other chain is longer        
        
        //TODO: implement
    }

    //TODO: Handle other blockchain being multiple blocks ahead

    isValidNewBlock(block){
        return true;
        //TODO
    }



    getTotalWalletSize(){
        //TODO
    }
}

const bc = new Blockchain();
bc.run();