import defaultConfig from './json/defaultConfig.json';
import { setStorageSyncValue, getConfiguration } from './utils/storage';
import { FFF_CONFIGURATION } from './utils/consts';

async function configureJsonEditor() {
    const container = document.getElementById("jsoneditor")
    const options = {}
    const editor = new JSONEditor(container, options)

    try {
        const configuration = await getConfiguration();
        editor.set(configuration);

        const submitConfigurationButton = document.getElementById('submit-configuration');
        submitConfigurationButton.addEventListener('click', () => {
            const configurationJson = editor.get();
            const configurationJsonStringify = JSON.stringify(configurationJson);

            setStorageSyncValue(FFF_CONFIGURATION, configurationJsonStringify);
        });

        const resetConfigurationButton = document.getElementById('reset-configuration');
        resetConfigurationButton.addEventListener('click', () => {
            editor.set(defaultConfig);
        });
    } catch (error) {
        console.error(error);
    }
}

async function main() {
    await configureJsonEditor();
}

main();
