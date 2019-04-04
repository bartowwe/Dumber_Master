
const elements = document.getElementsByTagName('*');

let clickedWord = function () {
    //clicked word function
    let s = window.getSelection();
    let range = s.getRangeAt(0);
    let node = s.anchorNode;

    //while 1. there's no space at the beginning and 2. if it's the first word of the doc, we're at the first spot
    while(range.toString().indexOf(' ') > 0 || (range.startOffset > 0 && range.toString().indexOf(' ') === -1)) { 
        range.setStart(node,(range.startOffset -1));
    }

    if(range.toString().indexOf(' ') === 0){ range.setStart(node, range.startOffset +1); }
    do{
        if (range.endOffset < node.length){
            range.setEnd(node,range.endOffset + 1);
        }
    } while(range.toString().indexOf(' ') === -1 && range.toString().trim() !== '' && range.endOffset < node.length);
    
    //if theres a period after the word
    let last = range.toString().substring(range.toString().length -1);
    if (last === ' ' || last === '.' || last === ',' || last === ':' || last === ';' || 
        last === '?' || last === '!' || last === '-' || last === ')')
    {
        range.setEnd(node,range.endOffset - 1);
    }

    //if theres a period after the word
    var str = range.toString().trim();
    let last2 = str.substring(str.length -1);
    if (last2 === ' ' || last2 === '.' || last2 === ',' || last2 === ':' || last2 === ';' ||
        last2 === '?' || last2 === '!' || last2 === '-' || last2 === ')' )
    {
      str = str.substring(0,str.length-1);
    }
    
    //sending the selected word to the API
    requestFunction(str);
} 

let requestFunction = function(word) {
  // console.log('flag 0: right before searchWord call');
  let xhr = new XMLHttpRequest();
  xhr.open("GET", `https://dumbr.herokuapp.com/api/dictionary?word=` + word, true);
  xhr.withCredentials = true;
  xhr.send();
      
  //how do I pause until i get the right response from this????
  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      // console.log('flag 2: right before resolve of searchword promise');
      replaceWordsOnPage(word, xhr.response);
    } else {
      console.error(xhr.statusText);
    }    
    xhr.onerror = () => reject(xhr.statusText);
  }
}

//function to add the definition after the word on the page. 
//Takes word and definition as parameters
let replaceWordsOnPage = function(word, def) {
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
        for (var j = 0; j < element.childNodes.length; j++) {
            var node = element.childNodes[j];
            if (node.nodeType === 3) {
              var text = node.nodeValue;
              var replacedText = text.replace(word, word + ' (' + def + ')');
                
              if (replacedText !== text) {
                element.replaceChild(document.createTextNode(replacedText), node);
              }
            }
        }
    }
}

