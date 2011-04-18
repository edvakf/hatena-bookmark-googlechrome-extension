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

    document.addEventListener('DOMContentLoaded', function() {
        // widget-embedder.css
        var css = [
            '.hBookmark-widget-counter {',
            '    background: none !important;',
            '    text-decoration: none !important;',
            '    margin: 0 0 0 2px;',
            '    border: none !important;',
            '    display: inline !important;',
            '}',
            '',
            '.hBookmark-widget-counter > img {',
            '    border: none;',
            '    vertical-align: middle;',
            '}'
        ].join('\n');
        var st = document.createElement('style');
        st.textContent = css;
        if (document.head) document.head.appendChild(st);
    }, false);
}