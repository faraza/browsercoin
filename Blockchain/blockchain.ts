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
    getLast5BlocksJSON(): string{
        const last5Blocks: string[] = []
        let i = (this.blocks.length < 5) ? 0 : this.blocks.length - 5;
        while(i < this.blocks.length){
            last5Blocks.push(JSON.stringify(this.blocks[i]));
            i++
        }

        return JSON.stringify(last5Blocks);
    }  
    
    getFullBlockchainJSON(): string{
        const blocksJSONArray = []
        for(let i = 0; i < this.blocks.length; i++){
            blocksJSONArray.push(JSON.stringify(this.blocks[i]))
        }

        return JSON.stringify(blocksJSONArray);
    }

    /**
     * After receiving new blocks from a peer, check 
     * if they can be added to the end of this chain and increase the chain
     * length.
     * If none of the blocks from the peer have a hash that attaches to this
     * chain, return false.
     * @param peerBlocks 
     * @returns 
     */
    doPeerBlocksFitOnChain(peerBlocks: Block[]): boolean{
        if(!this.isPeerBlockchainLonger(peerBlocks)) return false;        
        const leftmostPeerBlock = peerBlocks[0];
        if(leftmostPeerBlock.isGenesisBlock()) return true;

        for(let i = 0; i < this.blocks.length; i++){
            const curBlock = this.blocks[i];
            if(leftmostPeerBlock.prevHash == curBlock.getHash()) return true;
        }
        return false;        
    }

    isPeerBlockchainLonger(peerTail: Block[]): boolean{
        const peerLength = peerTail[peerTail.length - 1].blockNum + 1;
        return (this.blocks.length < peerLength)
    }

    isPeerBlockchainConsistent(peerBlocks: Block[]): boolean{
        for(let prevBlockIndex = 0; prevBlockIndex < peerBlocks.length -1; prevBlockIndex++){
            const prevBlock = peerBlocks[prevBlockIndex]
            const nextBlock = peerBlocks[prevBlockIndex + 1];

            prevBlock.recalculateHash()
            if(nextBlock.prevHash != prevBlock.hash)
                return false;
        }

        return true;
    }    

    addTailFromPeer(peerTail: Block[]): boolean{
        if(!this.isPeerBlockchainLonger(peerTail)){ 
            console.log("AddTailFromPeer. Peer is too short")
            return false;
        }
        if(!this.isPeerBlockchainConsistent(peerTail)){
            console.log("AddTailFromPeer. Peer is not consistent")
            return false;
        }

        if(!this.doPeerBlocksFitOnChain(peerTail)){
            console.log("AddTailFromPeer. Peer blocks don't fit on chain")
            return false;
        }

        if(peerTail[0].isGenesisBlock()){
            this.killMiningWorker();
            this.blocks = peerTail;
            this.runMiningLoop();
            return true;
        } 
        else{
            let startingIndex = 0;
            while(peerTail[0].prevHash != this.blocks[startingIndex++].getHash()){              //TODO: Handle divergent genesis blocks   
                if(startingIndex == this.blocks.length){
                    console.log("ERROR -- blockchain.ts::addTailFromPeer. Starting index == blocks.length. Starting index: " +
                    startingIndex +  "Blocks: ", this.blocks)
                    return false;
                }
            }
            this.killMiningWorker();
            for(let i = 0; i< peerTail.length; i++){
                const peerBlock = peerTail[i];
                if(!this.isValidNewBlock(peerBlock)){
                    console.log("ERROR -- blockchain.ts::addTailFromPeer. Peer block is invalid. Peer block: ", peerBlock, "\nCurrent chain:\n", this.blocks)
                    this.runMiningLoop();
                    return false;
                }
                this.blocks[startingIndex + i] = peerTail[i];
            }
            this.runMiningLoop();
            return true;
        }
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
        block.recalculateHash();
        
        this.blocks.push(block);
        return true;
    }

    printLatestBlock(): void{
        const latestBlock = this.blocks[this.blocks.length - 1]
        console.log("\n***New block mined! " + latestBlock.toStringForPrinting());
    }

    isValidNewBlock(block: Block): boolean{
        if(!block.confirmProofOfWork()) return false; 

        if(this.blocks.length == 0){
            if(block.blockNum !== 0) return false;            
            else return true;
        }

        const prevBlock = this.blocks[block.blockNum - 1];
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