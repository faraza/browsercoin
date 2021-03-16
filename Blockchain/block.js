
var sha256 = require('js-sha256');

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
        this.timestamp = timestamp;
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

    findNonce(startingNonce = 0){
        let curNonce = startingNonce;
        
        while(!this.isValidProofOfWork(curNonce)) curNonce++;        
        return curNonce;
    }

    isValidProofOfWork(inputNonce){        
        let hash = sha256(this.toStringForHashing(inputNonce.toString()));
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

        return sha256(this.toStringForHashing(inputNonce));
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
            + this.numZeros + this.prevHash + this.inputNonce);
    }

    toStringForPrinting(){
        return "Block num: " + this.blockNum + "\nminer: " + this.minerPublicKey + "\ntimestamp: "
        + this.timestamp + "\nreward: " + this.blockReward + "\nnumZeros: " + this.numZeros +
        "\nPrev Hash: " + this.prevHash + "\nNonce: " + this.nonce + "\nHash: " + this.getHash(); 
    }

    serialize(){
        //TODO
    }

    unserialize(serializedBlock){
        //TODO
    }
    
}
