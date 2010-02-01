function hmacSHA256(message, secret) {
    return Crypto.HMAC(Crypto.SHA256, message, secret, {asBytes: true});
}

function base64(bytes) {
    return Crypto.util.bytesToBase64(bytes);
}

function alnum(s) {
    return s.replace(/[^0-9A-Za-z]/g, '');
}

chrome.extension.onRequest.addListener(function(msg, src, send) {
    if (msg.pageAction) {
        chrome.pageAction[msg.pageAction](src.tab.id);
    }
    if (msg.title) {
        chrome.pageAction.setTitle({
            tabId: src.tab.id,
            title: msg.title
        });
    }
    if (msg.domain && msg.secret) {
        send(alnum(base64(hmacSHA256(msg.domain, msg.secret))).substr(0, 8));
    }
});

chrome.pageAction.onClicked.addListener(function(tab) {
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendRequest(tab.id, {clicked: true});
    });
});
