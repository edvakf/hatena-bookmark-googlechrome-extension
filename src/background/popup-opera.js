
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
            }
        },
    }
}
