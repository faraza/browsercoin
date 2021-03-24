"use strict";
exports.__esModule = true;
exports.NetworkManager = void 0;
var SignalHub = require('signalhub');
var Swarm = require('webrtc-swarm');
var NetworkManager = /** @class */ (function () {
    function NetworkManager(eventEmitter) {
        this.SERVERENDPOINT = 'https://browsercoin.herokuapp.com/';
        this.REQUESTFULLBLOCKCHAINMESSAGE = "REQUESTFULLBLOCKCHAIN";
        this.eventEmitter = eventEmitter;
        var coinName = "farazCoin";
        this.connectToSwarm(coinName);
    }
    NetworkManager.prototype.connectToSwarm = function (coinName) {
        var _this = this;
        var hub = new SignalHub(coinName, [this.SERVERENDPOINT]);
        this.swarm = (Swarm.WEBRTC_SUPPORT) ? Swarm(hub) : Swarm(hub, { wrtc: require('wrtc') });
        this.swarm.on('connect', function (peer, id) {
            console.log("Connected to peer: ", id);
            console.log("Total peers: " + _this.swarm.peers.length);
            peer.on('data', function (data) {
                _this.processMessageType(data.toString(), peer);
            });
        });
        this.swarm.on('disconnect', function (peer, id) {
            console.log("Disconnected from peer: ", id);
            console.log("Total peers: ", _this.swarm.peers.length);
        });
    };
    NetworkManager.prototype.processMessageType = function (message, peer) {
        if (message === this.REQUESTFULLBLOCKCHAINMESSAGE) {
            this.eventEmitter.emit('fullBlockchainRequested', peer);
        }
        else {
            this.eventEmitter.emit('blocksReceived', message, peer);
        }
    };
    NetworkManager.prototype.requestFullBlockchainFromPeer = function (peer) {
        peer.send(this.REQUESTFULLBLOCKCHAINMESSAGE);
    };
    NetworkManager.prototype.sendMessageToAllPeers = function (message) {
        this.swarm.peers.forEach(function (peer) {
            peer.send(message);
        });
    };
    NetworkManager.prototype.sendFullBlockchainToPeer = function (serializedBlocks, peer) {
        peer.send(serializedBlocks);
    };
    NetworkManager.prototype.sendSerializedBlocks = function (serializedBlocks) {
        this.sendMessageToAllPeers(serializedBlocks);
    };
    return NetworkManager;
}());
exports.NetworkManager = NetworkManager;
