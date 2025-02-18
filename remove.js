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

// Wait for 500 ms to allow the AI Overview to load
setTimeout(() => {
    // The title is in a <strong> which happens to be the first <strong> in the page
    // Change this to a more viable method ?
    let mx_body = document.getElementsByTagName('strong');

    // Return matches from the array
    const returnMatch = () => {
        return AI_OVERVIEW_MATCHES.some((word) => word.includes(mx_body[0].innerText.toLowerCase()));
    }

    // If we have a match, remove the 8th parent 
    // Also subject to change depending on how Google decides to change it
    if(mx_body.length > 0 && returnMatch()){
        let parent = mx_body[0].parentNode
        let i = 0;
        let currentNode = parent;
        while(i <9){
            currentNode = currentNode.parentNode;
            i++;
        }
        currentNode.outerHTML = ""
    }
    
}, 500);
