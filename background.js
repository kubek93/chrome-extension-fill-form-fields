chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.active) {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            const url = tabs[0].url;
            console.log(url);

            // chrome.tabs.executeScript({
            //     file: 'content.js'
            // });

            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id, allFrames: true},
                files: ['content.js'],
            });

            // if (url === 'https://www.google.com/') {
            //     console.log('JEST!', chrome.tabs);
            //     // chrome.tabs.executeScript({file: 'content.js'});
            //     // let [tab] = chrome.tabs.query({ active: true, currentWindow: true });
            //     console.log(document);
            //     // chrome.scripting.executeScript({
            //     //     target: { tabId: tabs[0].id },
            //     //     function: setFormInput,
            //     // });

            //     // console.log(document.querySelector('.gLFyf'));
            //     // chrome.runtime.sendMessage('abc');
            //     // document.querySelector('.gLFyf').value = "HIPER KUTAS";
            // } else {
            //     console.log('NIE MA!', url);
            // }
        });
    }
});
