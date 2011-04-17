
if (typeof Object.keys !== 'function') {
    Object.keys = function(obj) {
        var keys = [];
        for (var key in obj) if (obj.hasOwnProperty(key)) keys.push(key);
        return keys;
    };
}

if (typeof opera === 'object') {
    chrome = {
        extension: {
            getBackgroundPage: function() {
                return opera.extension.bgProcess;
            },
            connect: function() {
                // opera.extension.postMessage talks to background
                return {
                    onMessage: {
                        addListener: function(callback) {
                            opera.extension.addEventListener('message', function(e) {
                                var con; // not used
                                callback(e.data, con);
                            }, false);
                        }
                    },
                    postMessage: function(msg) {
                        opera.extension.postMessage(msg);
                    }
                }
            }
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        // don't know why this element is here
        $('#comment-show').hide();
    }, false);
}
