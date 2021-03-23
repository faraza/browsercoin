import {EventEmitter} from 'node:events';
import {Block} from './block'
const { fork } = require('child_process');
const randomInt = require('random-int');


export class Blockchain {    
        
    blocks: Block[]
    myPublicKey: string
    currentBlock: Block
    miningStartTime: Date
    eventEmitter: EventEmitter
    miningWorker: any
    readonly blockReward = 50
    readonly numZeros = 2 //TODO: Make this dynamic. When there's a lot of miners, blocks will be mined too fast

    constructor(eventEmitter){        
        this.blocks = []
        this.myPublicKey = "myPublicKey" + randomInt(10000);
        
        this.miningStartTime;
        this.eventEmitter = eventEmitter;
        console.log("*********BLOCKCHAIN PUBLIC KEY: ", this.myPublicKey);
    }

    /**
     * Returns less than 5 if the current blockchain is less than 5
     */
    getLast5Blocks(){
        const last5Blocks: Block[] = []
        let i = (this.blocks.length < 5) ? 0 : this.blocks.length - 5;
        while(i < this.blocks.length)
            last5Blocks.push(this.blocks[i++]);

        return last5Blocks;
    }

    /**
     * TODO: This will give an error if the method is not run from
     * the browsercoin working directory!
     */
    setupMiningWorker(): void{
        this.miningWorker = fork('./Blockchain/miner.js'); 
        this.miningWorker.on('message', this.nonceFoundHandler.bind(this));
    }    

    runMiningLoop(): void{
        console.log("mining loop start");
        this.miningStartTime = new Date();
        const prevHash = (this.blocks.length === 0 ? "0" : this.blocks[this.blocks.length-1].getHash());
        this.currentBlock = new Block({blockNum: this.blocks.length, minerPublicKey: this.myPublicKey,
            timestamp: this.miningStartTime.toString(), blockReward: this.blockReward, 
            numZeros: this.numZeros, prevHash: prevHash})
        console.log("run mining loop. ")
        this.setupMiningWorker();
        this.miningWorker.send(this.currentBlock.serialize());
    }

    nonceFoundHandler(nonce: number): void{
        console.log("nonce found handler start. Nonce: " , nonce);
        this.currentBlock.setNonce(nonce);
        const blockWasValid = this.pushBlockToEndOfChain(this.currentBlock)        

        const miningEndTime = new Date();
        const totalMiningTime = (<any>miningEndTime - <any>this.miningStartTime);
        if(blockWasValid){
            this.eventEmitter.emit('mined');
        }
        else{
            console.log("***ERROR - BLOCK WAS INVALID: " + this.currentBlock.toStringForPrinting());
        }
        console.log("*Block mining time: " + totalMiningTime);
        
        this.killMiningWorker();
        this.runMiningLoop();
    }

    pushBlockToEndOfChain(block: Block): boolean{
        if(!this.isValidNewBlock(block)) return false;
        
        this.blocks.push(block);
        return true;
    }

    printLatestBlock(): void{
        const latestBlock = this.blocks[this.blocks.length - 1]
        console.log("\n***New block mined! " + latestBlock.toStringForPrinting());
    }

    addBlockFromPeer(block: Block): boolean{
        if(!this.isValidNewBlock(block)) return false;
        this.killMiningWorker();
        this.pushBlockToEndOfChain(block) 
        this.runMiningLoop();
        return true;       
    }

    //TODO: Handle other blockchain being multiple blocks ahead
        //Don't accept until the other block is 3 ahead of you

    isValidNewBlock(block): boolean{
        if(!block.confirmProofOfWork()) return false; 
        if(block.blockNum !== this.blocks.length) return false;

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