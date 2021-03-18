const Signalhub = require('signalhub')


const hub = new Signalhub('basictest', [
    'https://browsercoin.herokuapp.com/'
])

hub.subscribe('channel1')
    .on('data', (message)=>{
        console.log("Signal data received: ", message);
    })


process.stdin.on('data', processData)

function processData(data){
    const message = Buffer.from(data).toString()
    hub.broadcast('channel1', message)
}