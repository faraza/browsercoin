
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

module.exports = class Block{    

    constructor(blockNum, minerPublicKey, timestamp, blockReward, numZeros, prevHash = 0){
        this.blockNum = blockNum;        
        this.minerPublicKey = minerPublicKey;
        this.timestamp = timestamp.toString();
        this.blockReward = blockReward
        this.numZeros = numZeros;
        
        this.prevHash = prevHash;
    }

    /**
     * 
     * @returns Doesn't confirm proof of work - just checks that it has a nonce (by default, nonce is null)
     */
    isMined(){
        return (this.nonce != null);        
    }

    resetToUnmined(){
        this.nonce = null;
    }

    setNonce(nonce){
        this.nonce = nonce;
    }    
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
      
    /**
     * Run this in a child process otherwise it WILL block the main thread!     
     * @returns 
     */
    async findNonce(){
        let curNonce = randomInt(99999999);
        while(!this.isValidProofOfWork(curNonce)){             
            curNonce++; 
            // await this.sleep(1) ;                                
        } 
        return curNonce;               
    }

    sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }  

      /**
       * NOTE: On my M1 mac it takes ~1.7ms on average to run one sha256
       * @param {*} inputNonce 
       * @returns 
       */
    isValidProofOfWork(inputNonce){        
        const hash = sha256(this.toStringForHashing(inputNonce.toString()));
        // console.log("Is valid proof of work. Nonce: " , inputNonce, " Hash: ", hash)
        return this.doesStringHaveLeadingZeros(hash)        
    }

    /**
     * Assumes the block has been mined
     */
    getHash(){
        if(this.nonce == null){
            console.log("ERROR. Block.js::getHash -- block not mined");
            return 0;
        }

        return sha256(this.toStringForHashing(this.nonce));
    }

    confirmProofOfWork(){
        if(this.nonce == null) return false;
        
        return this.isValidProofOfWork(this.nonce);
    }

    doesStringHaveLeadingZeros(stringToTest){
        for(let i = 0; i < this.numZeros; i++){
            if(stringToTest.charAt(i) !== '0') return false;
        }

        return true;
    }

    isGenesisBlock(){
        return (blockNum === 0);
    }
    
    /**
     * 
     * @param {Not necessary if block has already been mined, because then it will use its existing nonce} inputNonce 
     */
    toStringForHashing(inputNonce){
        return (this.blockNum + this.minerPublicKey + this.timestamp + this.blockReward
            + this.numZeros + this.prevHash + inputNonce);
    }

    toStringForPrinting(){
        return "Block num: " + this.blockNum + "\nminer: " + this.minerPublicKey + "\ntimestamp: "
        + this.timestamp + "\nreward: " + this.blockReward + "\nnumZeros: " + this.numZeros +
        "\nPrev Hash: " + this.prevHash + "\nNonce: " + this.nonce + "\nHash: " + this.getHash(); 
    }

    serialize(){
        return JSON.stringify(this);
    }

    static deserialize(blockJSON){        
        const parsedBlock = JSON.parse(blockJSON);

        const returnBlock = new Block(parsedBlock.blockNum, parsedBlock.minerPublicKey, parsedBlock.timestamp,
            parsedBlock.blockReward, parsedBlock.numZeros, parsedBlock.prevHash);

        returnBlock.nonce = parsedBlock.nonce;
        return returnBlock;
    }
    
}