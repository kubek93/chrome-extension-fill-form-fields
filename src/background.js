// chrome.tabs.onUpdated.addListener( async function (tabId, changeInfo, tab) {
//     if (changeInfo.status == 'complete' && tab.active) {
//         chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
//             // const url = tabs[0].url;
//             // if (url === 'https://www.google.com/');
//             chrome.scripting.executeScript({
//                 target: {tabId: tabs[0].id, allFrames: true},
//                 files: ['content.js'],
//             });
//         });
//     }
// });
