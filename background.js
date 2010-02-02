function b64hmac(message, secret) {
    var bytes = Crypto.HMAC(Crypto.SHA256, message, secret, {asBytes: true});
    return Crypto.util.bytesToBase64(bytes);
}

function first8(str) {
    return str.replace(/[^0-9A-Za-z]/g, '').substr(0, 8);
}

chrome.extension.onRequest.addListener(function(msg, src, send) {
    send(first8(b64hmac(msg.hostname, msg.secret)));
});
