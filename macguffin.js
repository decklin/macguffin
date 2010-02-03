var animLen = 250;
var focused = null;

function domain(hostname) {
    var last = function(n, a) { return a.slice(a.length - n, a.length); };
    var short = function(p) { return p.length <= 2; };
    var parts = hostname.split('.');
    var n = last(2, parts).every(short) ? 3 : 2;
    return last(n, parts).join('.');
}

$('input[type="password"]').removeAttr('maxlength').focus(function() {
    focused = this;
    chrome.extension.sendRequest({
        pageAction: 'show',
        title: domain(location.hostname)
    });
}).blur(function() {
    focused = null;
    chrome.extension.sendRequest({
        pageAction: 'hide'
    });
});

chrome.extension.onRequest.addListener(function(msg, src, send) {
    if (focused && msg.clicked) {
        var secretLen = focused.value.length;
        var animStep = animLen / (secretLen + 8);
        var queueSubstr = function(s, i) {
            $(focused).delay(animStep).queue(function() {
                $(this).val(s.substr(0, i + 1));
                $(this).dequeue();
            });
        }
        var req = {
            domain: domain(location.hostname),
            secret: focused.value
        };
        chrome.extension.sendRequest(req, function(hmac) {
            for (var i = secretLen - 1; i > 0; i--)
                queueSubstr(focused.value, i);
            for (var i = 0; i < 8; i++)
                queueSubstr(hmac, i);
        });
    }
});
