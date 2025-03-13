const AI_OVERVIEW_MATCHES = [
    'ai overview',
    'vista creada con ia',
    'visión general creada por ia',
    'ai जवाब',
    'visão geral criada por ia',
    'vista geral de ia',
    'ai による概要',
    'ai பதில்',
    'searching',
    'generating'
]

const returnMatch = (mx_body) => {
    return AI_OVERVIEW_MATCHES.some((word) => word.includes(mx_body[0].innerText.toLowerCase()));
}

const removeOverview = (mx_body) => {
    return new Promise((resolve, reject) => {
        if(mx_body && mx_body[0] && returnMatch(mx_body)){
            let parent = mx_body[0].parentNode;
            let i = 0;
            let currentNode = parent;
            while(i <9){
                currentNode = currentNode.parentNode;
                i++;
            }
            currentNode.outerHTML = ""
            resolve(true)
        }
        else{
            reject(false)
        }

    })
}

const retryFunc = async (attempts, maxAttempts=50) => {
    let delay = 500;
    await wait(delay);
    let mx_body = document.getElementsByTagName('strong');
    if(maxAttempts !== attempts){
        delay = delay + 100;
    }
    try{
        return await removeOverview(mx_body)
    }
    catch(e){
        if(attempts == maxAttempts){
            return false
        }
        retryFunc(attempts+1)
    }
}

const wait = ms => new Promise(r => setTimeout(r, ms));

const mainFunc = async () => {
    await retryFunc(0);
}

mainFunc();