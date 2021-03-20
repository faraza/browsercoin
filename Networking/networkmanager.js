const Signalhub = require('signalhub')
const {EventEmitter} = require('events')

module.exports = class NetworkManager{    
    APPNAME = 'browsercoin'
    SERVERENDPOINT = 'https://browsercoin.herokuapp.com/'
    CHANNEL = 'channel1'
    
    constructor(eventEmitter){
        this.eventEmitter = eventEmitter;
        this.setupSignalhub()        
    }

    setupSignalhub(){
        this.hub = new Signalhub(this.APPNAME,
        [this.SERVERENDPOINT])

        this.hub.subscribe(this.CHANNEL)
        .on('data', (message)=>{
            this.processMessageType(message);
        })        
    }

    processMessageType(message){
        //TODO: event emitter
        
        this.eventEmitter.emit('blockReceived', message);
    }

    sendMessage(message){
        this.hub.broadcast(this.CHANNEL, message);
    }

    sendSerializedBlock(serializedBlock){
        this.sendMessage(serializedBlock); //TODO: give it a key
    }


    //TODO: Handle peers
    //TODO: Store old messages so you ignore them
}