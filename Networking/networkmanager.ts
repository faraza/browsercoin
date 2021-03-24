import {EventEmitter} from "node:events"

const SignalHub = require('signalhub')
const Swarm = require('webrtc-swarm')

export class NetworkManager{    
    eventEmitter: EventEmitter
    swarm: typeof Swarm
    readonly SERVERENDPOINT = 'https://browsercoin.herokuapp.com/'
    readonly REQUESTFULLBLOCKCHAINMESSAGE = "REQUESTFULLBLOCKCHAIN"

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
            
            peer.on('data', (data)=>{
                this.processMessageType(data.toString(), peer)                
            })
        })
        this.swarm.on('disconnect', (peer, id)=>{
            console.log("Disconnected from peer: ", id)
            console.log("Total peers: ", this.swarm.peers.length)
        })
    }     

    processMessageType(message: string, peer){
        if(message === this.REQUESTFULLBLOCKCHAINMESSAGE){
            this.eventEmitter.emit('fullBlockchainRequested', peer)
        }
        else{
            this.eventEmitter.emit('blocksReceived', message, peer);
        }
    }

    requestFullBlockchainFromPeer(peer){
        peer.send(this.REQUESTFULLBLOCKCHAINMESSAGE);
    }

    private sendMessageToAllPeers(message: string){
        this.swarm.peers.forEach(peer => {
            peer.send(message);
        });        
    }  
    
    sendFullBlockchainToPeer(serializedBlocks: string, peer){
        peer.send(serializedBlocks);
    }

    sendSerializedBlocks(serializedBlocks: string){
        this.sendMessageToAllPeers(serializedBlocks);
    }
    
}