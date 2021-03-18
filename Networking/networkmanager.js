const Signalhub = require('signalhub')

module.exports = class NetworkManager{    
    APPNAME = 'browsercoin'
    SERVERENDPOINT = 'https://browsercoin.herokuapp.com/'
    CHANNEL = 'channel1'
    
    constructor(messageReceivedCallback){
        this.setupSignalhub(messageReceivedCallback)        
    }

    setupSignalhub(messageReceivedCallback){
        this.hub = new Signalhub(this.APPNAME,
        [this.SERVERENDPOINT])

        this.hub.subscribe(this.CHANNEL)
        .on('data', (message)=>{
            messageReceivedCallback(message);
        })        
    }

    sendMessage(message){
        this.hub.broadcast(this.CHANNEL, message);
    }


    //TODO: Handle peers
    //TODO: Store old messages so you ignore them
}