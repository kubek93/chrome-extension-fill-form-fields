function setValueToInput(inputSelector = "", inputValue = "") {
    const element = document.querySelector(inputSelector)

    if (element) {
        console.log(element);
        element.value = inputValue;
        element.setAttribute('value', inputValue);
        element.dispatchEvent(new Event('change'));
        element.dispatchEvent(new Event('blur'));
    } else {
        console.log(`Element ${inputSelector} is not foundable on opened page.`);
    }
}

function getStorageSyncValue(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get([key], function(result) {
            resolve(JSON.parse(result[key]));
        });
    });
}

async function setValuesToInputs() {
    try {
        const savedValues = await getStorageSyncValue('FFF_SAVED_VALUES');

        for(let key in savedValues) {
            console.log(savedValues[key]);
            setValueToInput(savedValues[key].selector, savedValues[key].value);
        }
    } catch (error) {
        console.error(error)
    };
}

onload = async function(e){
    setValuesToInputs();
    // document.getElementsByTagName('body')[0].style.background = 'red';
}
