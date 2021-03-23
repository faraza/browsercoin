"use strict";
exports.__esModule = true;
exports.NetworkManager = void 0;
var SignalHub = require('signalhub');
var Swarm = require('webrtc-swarm');
var NetworkManager = /** @class */ (function () {
    function NetworkManager(eventEmitter) {
        this.SERVERENDPOINT = 'https://browsercoin.herokuapp.com/';
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
        //TODO
        this.eventEmitter.emit('blockReceived', message);
    };
    NetworkManager.prototype.sendMessage = function (message) {
        this.swarm.peers.forEach(function (peer) {
            peer.send(message);
        });
        //TODO
    };
    NetworkManager.prototype.sendSerializedBlock = function (serializedBlock) {
        this.sendMessage(serializedBlock);
    };
    return NetworkManager;
}());
exports.NetworkManager = NetworkManager;
