import {EventEmitter} from "node:events"

const SignalHub = require('signalhub')
const Swarm = require('webrtc-swarm')

export class NetworkManager{    
    eventEmitter: EventEmitter
    swarm: typeof Swarm
    readonly SERVERENDPOINT = 'https://browsercoin.herokuapp.com/'
    

    constructor(eventEmitter){
        this.eventEmitter = eventEmitter;        
        const coinName = "farazCoin"
        this.connectToSwarm(coinName);        
    }

    connectToSwarm(coinName: string){        
        const hub = new SignalHub(coinName,
            [this.SERVERENDPOINT])   
        
        this.swarm = (Swarm.WEBRTC_SUPPORT) ? Swarm(hub) : Swarm(hub, {wrtc: require('wrtc')});
        this.swarm.on('connect', (peer, id)=>{
            console.log("Connected to peer: ", id)
            console.log("Total peers: " + this.swarm.peers.length);
        })
        this.swarm.on('disconnect', (peer, id)=>{
            console.log("Disconnected from peer: ", id)
            console.log("Total peers: ", this.swarm.peers.length)
        })
    }     

    processMessageType(message){
        //TODO
        
        // this.eventEmitter.emit('blockReceived', message);
    }

    sendMessage(message){
        //TODO
    }

    sendSerializedBlock(serializedBlock){
        this.sendMessage(serializedBlock);
    }

    
    //TODO: Store old messages so you ignore them
}