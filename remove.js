let mx_body = document.getElementsByTagName('strong')


if(mx_body[0].innerText.toLocaleLowerCase() == 'ai overview'){
    let parent = mx_body[0].parentNode
    let i = 0;
    let currentNode = parent;
    while(i <9){
        currentNode = currentNode.parentNode;
        i++;
    }
    currentNode.outerHTML = ""
}