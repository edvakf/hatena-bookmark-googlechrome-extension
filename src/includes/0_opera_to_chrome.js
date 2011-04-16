if (typeof opera === 'object') {
    // page's global variables
    location = window.location;
    HTMLImageElement = window.HTMLImageElement;
    XPathResult = window.XPathResult;
    navigator = window.navigator;

    // chrome util
    chrome = {
        extension: {
            connect: function() {
                return { // port object
                    onMessage: {
                        addListener: function(callback) {
                            opera.extension.onmessage = callback;
                        }
                    },
                    postMessage: function(msg) {
                        opera.extension.postMessage(msg);
                    }
                };
            }
        }
    };
}