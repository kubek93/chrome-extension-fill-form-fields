function setValueToInput(inputSelector = "", inputValue = "") {
    const element = document.querySelector(inputSelector)

    if (element) {
        element.value = inputValue;
    } else {
        console.log(`Element ${inputSelector} nie znaleziony.`);
    }
}

function getStorageSyncValue(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get([key], function(result) {
            console.log('Value currently is ' + result[key]);
            resolve(result[key]);
        });
    });
}

async function setValuesToInputs() {
    try {
        const configuration = await getStorageSyncValue('configuration');
        const parsedConfiguration = JSON.parse(configuration);

        console.log(parsedConfiguration);

        for(let key in parsedConfiguration) {
            setValueToInput(`#${key}`, parsedConfiguration[key]);
        }
    } catch (error) {
        console.error(error)
    };
}

onload = async function(e){
    setValuesToInputs();
    document.getElementsByTagName('body')[0].style.background = 'red';
}
