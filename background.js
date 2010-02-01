function b64hmac(message, secret) {
    var bytes = Crypto.HMAC(Crypto.SHA256, message, secret, {asBytes: true});
    return Crypto.util.bytesToBase64(bytes);
}

function first8(str) {
    return str.replace(/[^0-9A-Za-z]/g, '').substr(0, 8);
}

chrome.extension.onRequest.addListener(function(msg, src, send) {
    if (msg.pageAction) {
        chrome.pageAction[msg.pageAction](src.tab.id);
    } else {
        send(first8(b64hmac(msg.hostname, msg.secret)));
    }
});

chrome.pageAction.onClicked.addListener(function(tab) {
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendRequest(tab.id, {clicked: true});
    });
});
