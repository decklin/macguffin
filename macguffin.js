var animLength = 250;

// The extension callback is applied in global context, so we need to
// keep a reference to the <input>.

$('input[type="password"]').each(function(n, passwd) {
    var hmacButton = $('<img>').attr(
        'src', chrome.extension.getURL('keyring.png')
    ).css({
        verticalAlign: 'text-bottom'
    }).click(function() {
        var req = {
            hostname: location.hostname,
            secret: passwd.value
        };
        chrome.extension.sendRequest(req, function(hmac) {
            var secretLen = passwd.value.length;
            var animStep = animLength / (passwd.value.length + 8);
            var queueSubstr = function(s, i) {
                $(passwd).delay(animStep).queue(function() {
                    this.value = s.substr(0, i + 1);
                    $(this).dequeue();
                });
            }
            for (var i = passwd.value.length - 1; i > 0; i--)
                queueSubstr(passwd.value, i);
            for (var i = 0; i < 8; i++)
                queueSubstr(hmac, i);
        });
    });

    $(this).after(hmacButton);
});
