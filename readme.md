# Chrome Extension - Fill Form Fields

## Developing

During development process `esbuild` library is helping us to bundle `.js` file / import packages.

- `background.js` - A common need for extensions is to have a single long-running script to manage some task or state. Background pages to the rescue.The background page is an HTML page that runs in the extension process. It exists for the lifetime of your extension, and only one instance of it at a time is active.
- `content.js` - Content scripts are JavaScript files that run in the context of web pages. By using the standard Document Object Model (DOM), they can read details of the web pages the browser visits, or make changes to them.
- `options.js` - Script run on open options page.
- `popup.js` - Script run on open popup.
