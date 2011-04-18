
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

        // auto-adjust window size
        var popup = opera.extension.bgProcess.OperaButton.popup;
        setTimeout(function() {
            popup.width = document.body.style.width; // set in popup.js
        }, 10);
        setInterval(function() {
            popup.height = Math.max(200, // minimum height
                $('#main:visible').outerHeight() ||
                $('#eula:visible').outerHeight());
        }, 100);

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
                    '<p>',
                        '<label for="name">ユーザー名</label>',
                        '<input id="name" name="name" />',
                    '</p>',
                    '<p>',
                        '<label for="password">パスワード</label>',
                        '<input type="password" id="password" name="password" />',
                    '</p>',
                    '<p>',
                        '<input type="checkbox" id="persistent" name="persistent" value="1" checked/>',
                        '<label for="persistent">次回から自動的にログイン</label>',
                        '<input type="submit" value="ログイン" />',
                    '</p>',
                '</form>'
            ].join('\n'))
            .appendTo($(this).parent())
            .submit(function() {
                if (!$(this).find('#name').val()) {
                    $('#bookmark-login-header').text('ユーザー名が空欄です').css('color', 'red');
                } else if (!$(this).find('#password').val()) {
                    $('#bookmark-login-header').text('パスワードが空欄です').css('color', 'red');
                } else {
                    $.post('http://www.hatena.ne.jp/login', $(this).serialize())
                    .next(function() {
                        opera.extension.postMessage({message: 'login_check'});
                        $('#bookmark-login-header')
                        .html(
                            'ログイン完了。3秒後にリロードします。' +
                            '<br/>' +
                            '「ログインしていません」と出た場合は一旦閉じて再度開いてください。')
                        .css('color', 'red');
                        setTimeout(function() {
                            location.reload();
                        }, 3000);
                    });
                    $(this).find('input').attr('disabled', 'disabled');
                }
                return false;
            });
            return false;
        });
    }, false);
}
