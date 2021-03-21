"use strict";
exports.__esModule = true;
exports.NetworkManager = void 0;
var SignalHub = require('signalhub');
var NetworkManager = /** @class */ (function () {
    function NetworkManager(eventEmitter) {
        this.APPNAME = 'browsercoin';
        this.SERVERENDPOINT = 'https://browsercoin.herokuapp.com/';
        this.CHANNEL = 'channel1';
        this.eventEmitter = eventEmitter;
        this.setupSignalhub();
    }
    NetworkManager.prototype.setupSignalhub = function () {
        var _this = this;
        this.hub = new SignalHub(this.APPNAME, [this.SERVERENDPOINT]);
        this.hub.subscribe(this.CHANNEL)
            .on('data', function (message) {
            _this.processMessageType(message);
        });
    };
    NetworkManager.prototype.processMessageType = function (message) {
        //TODO: event emitter
        this.eventEmitter.emit('blockReceived', message);
    };
    NetworkManager.prototype.sendMessage = function (message) {
        this.hub.broadcast(this.CHANNEL, message);
    };
    NetworkManager.prototype.sendSerializedBlock = function (serializedBlock) {
        this.sendMessage(serializedBlock); //TODO: give it a key
    };
    return NetworkManager;
}());
exports.NetworkManager = NetworkManager;
