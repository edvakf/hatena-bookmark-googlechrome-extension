if (typeof opera === 'object') {
    // page's global variables
    location = window.location;
    HTMLImageElement = window.HTMLImageElement;
    XPathResult = window.XPathResult;
    Node = window.Node;
    navigator = window.navigator;

    // chrome util
    chrome = {
        extension: {
            connect: function() {
                return { // port object
                    onMessage: {
                        addListener: function(callback) {
                            opera.extension.addEventListener('message', function(e) {
                                callback(e.data);
                            }, false);
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