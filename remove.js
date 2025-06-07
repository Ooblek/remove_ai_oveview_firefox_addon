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

const SEARCH_DIV_ID ='search';
const GENERIC_WAIT_DELAY = 200


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


const overViewCall = async () => {
    try{
        let mx_body = document.getElementsByTagName('strong');
        return await removeOverview(mx_body)
    }
    catch(e){
        logError(`FAILED TO REMOVE THE AI OVERVIEW: ${e}`)
    }
}

const genericRetryFunction = async (attempts, maxAttempts=50, callback) => {
    await wait(GENERIC_WAIT_DELAY);
    try{
        if(attempts !== maxAttempts){
            if(callback()){
                return true
            }
            return genericRetryFunction(attempts + 1, maxAttempts, callback)
        }   

    }
    catch(e){
        logError(e)
        if(attempts == maxAttempts){
            return false;
        }
        return genericRetryFunction(attempts + 1, maxAttempts, callback);
    }


}

const wait = ms => new Promise(r => setTimeout(r, ms));

const findPeopleAlsoAsk = () => {
    try{
        let spans = document.getElementById(SEARCH_DIV_ID).getElementsByTagName('span');
        if(spans && spans.length > 0){
            for(item of spans){
                if(item.innerText && returnPAAMatch(item)){
                    return item;
                }
            }
        }
    }
    catch(e){
        logError(e)
        return null
    }

    return null
}

const removePeopleAlsoAskMatches = () => {
    let paaSpan = findPeopleAlsoAsk();
    try{
        let fullDiv= paaSpan.parentNode.parentNode.parentNode;

        // WILL PROBABLY BREAK IN THE FUTURE. NEED A BETTER WAY TO FIND THE ACCORDIONS. MAYBE TRACK THE SPRX-BUGFIX COMPONENT?
        let accordionDiv = fullDiv.children[1].children[1]
        if(accordionDiv){
            let aiOverviewDivs = accordionDiv.getElementsByTagName('strong');
            if(aiOverviewDivs){
                for(let t of aiOverviewDivs){
                    // EXTREMELY STUPID WAY OF DOING THIS
                    t.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.outerHTML = ""
                }
                muO.observe(accordionDiv, {childList: true})
                return true
            }
        }
        return false

    }
    catch(e){
        logError(e);
        return false
    }
}

const logError = (e) => {
    console.error(`remove-google-ai-overview-error: ${e}`)
}

const main = async () => {
    // To avoid page load issues. Google overrides all load events
    setTimeout(async () => {
        try{
            await genericRetryFunction(0, 50, overViewCall);
            await genericRetryFunction(0,50, removePeopleAlsoAskMatches);
        }
        catch(e){
            logError(e)
        }
    }, GENERIC_WAIT_DELAY*2)
}

main();