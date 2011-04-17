
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

        // add logout button
        $('#username').parent()
        .append('<input type="button" value="ログアウト">')
        .click(function() {
            this.disabled = true;
            $.get('http://www.hatena.ne.jp/logout').next(function() {
                opera.extension.postMessage({message: 'logout'});
                setTimeout(function() {
                    ViewManager.show('bookmark');
                }, 500);
            });
        });

        // add login form
        $('a[href^="http://www.hatena.ne.jp/login"]').click(function() {
            if ($('#loginform').length) return false;
            $([
                '<form id="loginform">',
                '<p>ユーザー名 <input id="login_username" /></p>',
                '<p>パスワード <input type="password" id="login_password" /></p>',
                '<p><input type="submit" value="ログイン" /></p>',
                '</form>'
            ].join('\n'))
            .appendTo($(this).parent())
            .submit(function() {
                $(this).find('input').attr('disabled', 'disabled');
                var name = $(this).find('#login_username').val();
                var pass = $(this).find('#login_password').val();
                if (!name) {
                    $('#bookmark-login-header').text('ユーザー名が空欄です');
                } else if (!pass) {
                    $('#bookmark-login-header').text('パスワードが空欄です');
                } else {
                    $.post('http://www.hatena.ne.jp/login', {
                        name: name,
                        password: pass
                    }).next(function() {
                        opera.extension.postMessage({message: 'login_check'});
                        $('#bookmark-login-header').text('ログイン完了。3秒後にリロードします。切り替わらない場合は再度開いてください。');
                        setTimeout(function() {
                            location.reload();
                        }, 3000);
                    });
                }
                return false;
            });
            return false;
        });
    }, false);
}
