// ==UserScript==
// @include http://www.hatena.ne.jp/logout
// @include https://www.hatena.ne.jp/logout
// @include http://www.hatena.ne.jp/logout*
// @include https://www.hatena.ne.jp/logout*
// ==/UserScript==

//{
//  "run_at": "document_end",
//  "all_frames": false,
//  "js": [
//    "content/logout.js"
//  ],
//  "matches": [
//    "http://www.hatena.ne.jp/logout",
//    "https://www.hatena.ne.jp/logout",
//    "http://www.hatena.ne.jp/logout*",
//    "https://www.hatena.ne.jp/logout*"
//  ]
//},

var port = chrome.extension.connect();
port.postMessage({
    message: 'logout',
    data: {
        url: location.href,
    }
});

