var sha256 = require('js-sha256');



const startTime = Date.now();

let numToHash = 0;
let numZerosTarget = 3;
while(true){
    let hash = sha256((numToHash++).toString());
    let proofOfWorkPassed = true;
    for(let i = 0; i < numZerosTarget; i++){
        if(hash.charAt(i) != '0'){
            proofOfWorkPassed = false;
            break;
        }
    }

    if(proofOfWorkPassed){
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        console.log("*****Proof of work passed! Total time: " + totalTime + "\n" + hash);
        break;
    }
    else{
        console.log(numToHash + ": " + hash);
    }

}


