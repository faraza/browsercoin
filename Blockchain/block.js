
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

    mine(inputNonce){
        if(this.isValidProofOfWork(inputNonce)){
            this.nonce = inputNonce;
            return true;
        }

        return false;
    }

    isValidProofOfWork(inputNonce){        
        let hash = sha256(this.toStringForHashing(inputNonce));
        return this.doesStringHaveLeadingZeros(hash)        
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

    serialize(){
        //TODO
    }

    unserialize(serializedBlock){
        //TODO
    }
    
}
