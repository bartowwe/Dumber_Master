// ON/OFF Switch

var toggle = false;

chrome.browserAction.onClicked.addListener(function(tab) {
    toggle = !toggle;
    if(toggle){
        chrome.browserAction.setIcon({path: "images/dumbr32.png", tabId:tab.id});
        chrome.tabs.executeScript(tab.id, {code:"document.addEventListener('click', clickedWord);"});

    }
    else{
        chrome.browserAction.setIcon({path: "images/dumbr32Off.png", tabId:tab.id});
        chrome.tabs.executeScript(tab.id, {code:"document.removeEventListener('click', clickedWord);"});
    }
});

// END ON/OFF