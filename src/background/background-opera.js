
if (typeof Object.keys !== 'function') {
    Object.keys = function(obj) {
        var keys = [];
        for (var key in obj) if (obj.hasOwnProperty(key)) keys.push(key);
        return keys;
    };
}

if (typeof opera === 'object') {
    // browser action button
    var OperaButton = opera.contexts.toolbar.createItem({
        disabled : false,
        title : 'Hatena Bookmark',
        icon : '../images/chrome-b-plus.png',
        popup : {
            width: '500px',
            height: '600px',
            href: 'popup.html'
        },
        badge: {
            color: '#ffffff',
            display: 'block',
        }
    });
    opera.contexts.toolbar.addItem(OperaButton);

    // constructor-like
    var OperaTabPort = function(con) {
        //emulate chrome's Port object
        var port = {
            postMessage: function(msg) {
                con.postMessage(msg);
            },
            onMessage: {
                listeners: [],
                addListener: function(cb) {
                    cb.listener = function(e) { if (e.source === con) cb(); };
                    port.onMessage.listeners.push(cb.listener);
                    opera.extension.addEventListener('message', function(e) {
                        if (e.source !== con) return;
                        cb(e.data, port);
                    }, false);
                },
                removeListener: function(cb) {
                    var idx = port.onMessage.listeners.indexOf(cb.listener);
                    if (idx >= 0) {
                        opera.extension.removeEventListener('message', cb.listener, false);
                        port.onMessage.listeners.splice(idx, 1);
                    }
                }
            },
            onDisconnect: {
                listeners: [],
                addListener: function(cb) {
                    cb.listener = function(e) { if (e.source === con) cb(); };
                    port.onDisconnect.listeners.push(cb.listener);
                    opera.extension.addEventListener('disconnect', cb.listener, false);
                },
                removeListener: function(cb) {
                    var idx = port.onDisconnect.listeners.indexOf(cb.listener);
                    if (idx >= 0) {
                        opera.extension.removeEventListener('disconnect', cb.listener, false);
                        port.onDisconnect.listeners.splice(idx, 1);
                    }
                }
            }
        };
        //when connection is closed, remove all remaining listeners to prevent memory leak
        opera.extension.addEventListener('disconnect', function(e){
            port.onMessage.listeners.forEach(function(listener) {
                opera.extension.removeEventListener('message', listener, false);
            });
            port.onDisconnect.listeners.forEach(function(listener) {
                opera.extension.removeEventListener('message', listener, false);
            });
        }, false);
        return port;
    };

    // Chrome Extension API (background page)
    chrome = {
        tabs : {
            create: function(props, cb) {
                props.focused = props.selected;
                var tab = opera.extension.tabs.create(props);
                if (cb) setTimeout(function() { cb(tab) }, 10);
            },
            connect: function() {},
            get: function() {},
            getSelected: function(windowId, cb) {
                var tab = opera.extension.tabs.getFocused(); // may return an iframe due to Opera's bug.
                //if (tab) {
                    //tab.id = 0; //XXX
                    //tab.windowId = windowId || 0; //XXX
                //}
                if (cb) setTimeout(function() { cb(tab) }, 10);
            },
            onSelectionChanged : {
                addListener: function(callback) {
                    opera.extension.tabs.onfocus = callback; // arguments?
                },
            },
            onUpdated : {
                addListener: function() {} // just ignore
            }
        },
        windows : {
            getCurrent: function(cb) {
                var win = opera.extension.windows.getFocused();
                //win.id = 0; // XXX
                if (cb) setTimeout(function() { cb(win) }, 10);
            },
            getLastFocused: function() {},
            getAll: function() {},
            create: function() {},
            remove: function() {},
            update: function() {},
            onRemoved: {
                addListener: function() {}
            },
        },
        browserAction: {
            setIcon: function(detail) {
                OperaButton.icon = detail.path;
            },
            setBadgeText: function(detail) {
                OperaButton.badge.textContent = detail.text;
            },
            setBadgeBackgroundColor: function(detail) {
                OperaButton.badge.backgroundColor = 'rgba(' + detail.color.join(',') + ')';
            },
            onClicked: {
                addListener: function (callback) {
                    OperaButton.addEventListener('click', function() {
                        var tab = opera.extension.tabs.getFocused();
                        if (tab) callback(tab);
                    }, false);
                }
            }
        },
        self: {
            onConnect: {
                addListener: function (callback) {
                    opera.extension.addEventListener('connect', function(ev) {
                        var port = new OperaTabPort(ev.source);
                        var name; // not implemented in Opera
                        callback(port, name);
                    }, false);
                }
            }
        }
    };
}
