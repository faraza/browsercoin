/**
 * Miner should be forked as a child process
 * otherwise it WILL block the main thread
 */


 process.on('findNonce', (input) =>{    
     console.log("Test child! Input: " + input)
     process.send("child test done");
 })