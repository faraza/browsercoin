//Get local host working

const prompt = require('prompt-sync')({sigint: true});
const Signalhub = require('signalhub')


const hub = new Signalhub('basictest', [
    // 'https://testsignalhub001.herokuapp.com/'
  'http://localhost:8080/'  
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