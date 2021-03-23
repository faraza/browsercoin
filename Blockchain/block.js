"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Block = void 0;
var sha256 = require('js-sha256');
var randomInt = require('random-int');
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
var Block = /** @class */ (function () {
    function Block(blockInfo) {
        this.blockNum = blockInfo.blockNum;
        this.minerPublicKey = blockInfo.minerPublicKey;
        this.timestamp = blockInfo.timestamp;
        this.blockReward = blockInfo.blockReward;
        this.numZeros = blockInfo.numZeros;
        this.prevHash = blockInfo.prevHash;
    }
    Block.prototype.setNonce = function (nonce) {
        this.nonce = nonce;
    };
    Block.prototype.sleep = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    Block.prototype.serializeBlockArray = function (blockArray) {
        //TODO
    };
    Block.prototype.deserializeBlockArray = function (serializedBlockArray) {
        //TODO
        return [];
    };
    /**
     * Run this in a child process otherwise it WILL block the main thread!
     * @returns
     * Putting sleep in here is important because even a sleep of 1
     * GREATLY decreases CPU usage
     */
    Block.prototype.findNonce = function () {
        return __awaiter(this, void 0, void 0, function () {
            var curNonce;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        curNonce = randomInt(99999999);
                        _a.label = 1;
                    case 1:
                        if (!!this.isValidProofOfWork(curNonce)) return [3 /*break*/, 3];
                        curNonce++;
                        return [4 /*yield*/, this.sleep(5)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/, curNonce];
                }
            });
        });
    };
    /**
     * NOTE: On my M1 mac it takes ~1.7ms on average to run one sha256
     * @param {*} inputNonce
     * @returns
     */
    Block.prototype.isValidProofOfWork = function (inputNonce) {
        var hash = sha256(this.toStringForHashing(inputNonce.toString()));
        // console.log("Is valid proof of work. Nonce: " , inputNonce, " Hash: ", hash)
        return this.doesStringHaveLeadingZeros(hash);
    };
    /**
     * Assumes the block has been mined
     */
    Block.prototype.getHash = function () {
        if (this.nonce == null) {
            console.log("ERROR. Block.js::getHash -- block not mined");
            return "0";
        }
        return sha256(this.toStringForHashing(this.nonce));
    };
    Block.prototype.confirmProofOfWork = function () {
        if (this.nonce == null)
            return false;
        return this.isValidProofOfWork(this.nonce);
    };
    Block.prototype.doesStringHaveLeadingZeros = function (stringToTest) {
        for (var i = 0; i < this.numZeros; i++) {
            if (stringToTest.charAt(i) !== '0')
                return false;
        }
        return true;
    };
    Block.prototype.isGenesisBlock = function () {
        return (this.blockNum === 0);
    };
    Block.prototype.toStringForHashing = function (inputNonce) {
        return (this.blockNum + this.minerPublicKey + this.timestamp + this.blockReward
            + this.numZeros + this.prevHash + inputNonce);
    };
    Block.prototype.toStringForPrinting = function () {
        return "Block num: " + this.blockNum + "\nminer: " + this.minerPublicKey + "\ntimestamp: "
            + this.timestamp + "\nreward: " + this.blockReward + "\nnumZeros: " + this.numZeros +
            "\nPrev Hash: " + this.prevHash + "\nNonce: " + this.nonce + "\nHash: " + this.getHash();
    };
    Block.prototype.serialize = function () {
        return JSON.stringify(this);
    };
    Block.deserialize = function (blockJSON) {
        var parsedBlock = JSON.parse(blockJSON);
        var returnBlock = new Block({ blockNum: parsedBlock.blockNum, minerPublicKey: parsedBlock.minerPublicKey,
            timestamp: parsedBlock.timestamp, blockReward: parsedBlock.blockReward, numZeros: parsedBlock.numZeros, prevHash: parsedBlock.prevHash });
        returnBlock.nonce = parsedBlock.nonce;
        return returnBlock;
    };
    return Block;
}());
exports.Block = Block;
