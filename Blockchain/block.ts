
var sha256 = require('js-sha256');
const randomInt = require('random-int');

/**
 * Block will consist of:
 * 
 * Block Number
 * Hash of previous block (empty if genesis)
 * Miner public key
 * Nonce
 * Timestamp
 * Block reward
 * NumZeros
 * 
 * Transactions (TODO Later)
 */

export class Block{    
    blockNum: number
    minerPublicKey: string
    timestamp: string
    blockReward: number
    numZeros: number
    prevHash: string
    nonce: number
    hash: ""

    constructor(blockInfo : {blockNum: number, minerPublicKey: string, timestamp: string, blockReward: number, numZeros: number, prevHash: string}){
        this.blockNum = blockInfo.blockNum        
        this.minerPublicKey = blockInfo.minerPublicKey
        this.timestamp = blockInfo.timestamp
        this.blockReward = blockInfo.blockReward
        this.numZeros = blockInfo.numZeros
    
        this.prevHash = blockInfo.prevHash
        this.hash = ""
    }

    setNonce(nonce): void{
        this.nonce = nonce;
    }    
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
      
    serializeBlockArray(blockArray: Block []){
        //TODO
    }

    deserializeBlockArray(serializedBlockArray: string): Block[] {
        //TODO
        return []
    }

    /**
     * Run this in a child process otherwise it WILL block the main thread!     
     * @returns 
     * Putting sleep in here is important because even a sleep of 1
     * GREATLY decreases CPU usage
     */
    async findNonce(): Promise<number>{
        let curNonce :number  = randomInt(99999999);
        while(!this.isValidProofOfWork(curNonce)){             
            curNonce++; 
            await this.sleep(15) ;                                
        } 
        return curNonce;               
    } 

      /**
       * NOTE: On my M1 mac it takes ~1.7ms on average to run one sha256
       * @param {*} inputNonce 
       * @returns 
       */
    isValidProofOfWork(inputNonce): boolean{        
        const hash = sha256(this.toStringForHashing(inputNonce.toString()));
        return this.doesStringHaveLeadingZeros(hash)        
    }

    /**
     * Assumes the block has been mined     
     */
    getHash(): string{
        if(this.nonce == null){
            console.log("ERROR. Block.js::getHash -- block not mined");
            return "0";
        }
        if(this.hash == "") this.hash = sha256(this.toStringForHashing(this.nonce)); //TODO
        // this.hash = sha256(this.toStringForHashing(this.nonce));
        return this.hash;        
    }

    /**
     * Security feature. Make sure you recalculate the hash of any block you get from the network
     */
    recalculateHash(){
        this.hash = sha256(this.toStringForHashing(this.nonce));
    }

    confirmProofOfWork(): boolean{
        if(this.nonce == null) return false;
        
        return this.isValidProofOfWork(this.nonce);
    }

    protected doesStringHaveLeadingZeros(stringToTest): boolean{
        for(let i = 0; i < this.numZeros; i++){
            if(stringToTest.charAt(i) !== '0') return false;
        }

        return true;
    }

    isGenesisBlock(): boolean{
        return (this.blockNum === 0);
    }
        
    toStringForHashing(inputNonce: number): string{
        return (this.blockNum + this.minerPublicKey + this.timestamp + this.blockReward
            + this.numZeros + this.prevHash + inputNonce);
    }

    toStringForPrinting(): string{
        return "Block num: " + this.blockNum + "\nminer: " + this.minerPublicKey + "\ntimestamp: "
        + this.timestamp + "\nreward: " + this.blockReward + "\nnumZeros: " + this.numZeros +
        "\nPrev Hash: " + this.prevHash + "\nNonce: " + this.nonce + "\nHash: " + this.getHash(); 
    }

    serialize(): string{
        return JSON.stringify(this);
    }

    static deserialize(blockJSON){     
        const parsedBlock = JSON.parse(blockJSON);

        const returnBlock = new Block({blockNum: parsedBlock.blockNum, minerPublicKey: parsedBlock.minerPublicKey,
        timestamp: parsedBlock.timestamp, blockReward: parsedBlock.blockReward, numZeros: parsedBlock.numZeros, prevHash: parsedBlock.prevHash})  

        returnBlock.nonce = parsedBlock.nonce;
        returnBlock.recalculateHash();
        return returnBlock;           
    }
    
}