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

const PEOPLE_ALSO_ASK = [
    'people also ask',
    'लोग यह भी जानना चाहते हैं',
    'más preguntas',
    'as pessoas também perguntam',
    '関連する質問',
    'பிறர் இவற்றையும் கேட்டுள்ளனர்'    
];

const returnMatch = (mx_body) => {
    if(mx_body.length == 0){
        return null
    }
    return AI_OVERVIEW_MATCHES.some((word) => word.includes(mx_body[0].innerText.toLowerCase()));
}

const returnPAAMatch = (span) => {
    return PEOPLE_ALSO_ASK.some((word) => word.includes(span.innerText.toLowerCase()));
}

let muO = new MutationObserver((list, _o) => {
    if(list[0].addedNodes.length !== 0 && !list[0].addedNodes[0].getAttribute('style')){
        for(item of list){ 
            if( item.addedNodes.length > 0 && item.addedNodes[0].nodeName == "DIV" && item.addedNodes[0].getElementsByTagName('strong').length > 0){
                item.addedNodes[0].outerHTML = ""
            }
        }
    }
})

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

const findPeopleAlsoAsk = () => {
    let spans = document.getElementsByTagName('span');
    if(spans && spans.length > 0){
        for(item of spans){
            if(item.innerText && returnPAAMatch(item)){
                return item;
            }
        }
        
    }
}

const main = async () => {
    let paaSpan = findPeopleAlsoAsk();
    if(paaSpan){
        let fullDiv= paaSpan.parentNode.parentNode.parentNode.parentNode;
        muO.observe(fullDiv.children[1], {childList: true})
    }
    await retryFunc(0);
}

main();