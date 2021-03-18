const Networking = require('./Networking/networkmanager');






function networkingBasicTest(){
    let network = new Networking((message)=>{
        console.log("Message Received: ", message)
    })

    let messageNum = 0;
    setInterval(()=>{
        network.sendMessage(messageNum++)
    }, 2000)
}

networkingBasicTest();