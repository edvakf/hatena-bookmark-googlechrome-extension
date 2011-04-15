// ==UserScript==
// @include http://b.hatena.ne.jp/guide/chrome_register
// @include http://b.hatena.ne.jp/guide/chrome_register*
// @include http://www.hatena.ne.jp/login
// @include https://www.hatena.ne.jp/login
// @include http://www.hatena.ne.jp/login*
// @include https://www.hatena.ne.jp/login*
// ==/UserScript==

//{
//  "run_at": "document_end",
//  "all_frames": false,
//  "js": [
//    "content/login_check.js"
//  ],
//  "matches": [
//    "http://b.hatena.ne.jp/guide/chrome_register",
//    "http://b.hatena.ne.jp/guide/chrome_register*",
//    "http://www.hatena.ne.jp/login",
//    "https://www.hatena.ne.jp/login",
//    "http://www.hatena.ne.jp/login*",
//    "https://www.hatena.ne.jp/login*"
//  ]
//},

var port = chrome.extension.connect();
port.postMessage({
    message: 'login_check',
    data: {
        url: location.href,
    }
});

