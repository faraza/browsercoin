import {EventEmitter} from "node:events"

const SignalHub = require('signalhub')

export class NetworkManager{    
    eventEmitter: EventEmitter
    hub: typeof SignalHub
    
    readonly APPNAME = 'browsercoin'
    readonly SERVERENDPOINT = 'https://browsercoin.herokuapp.com/'
    readonly CHANNEL = 'channel1'
    
    constructor(eventEmitter){
        this.eventEmitter = eventEmitter;
        this.setupSignalhub()        
    }

    setupSignalhub(){
        this.hub = new SignalHub(this.APPNAME,
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