#!/usr/bin/python

import sys
import re
import base64
import hashlib
import hmac
import getpass

def alnum(s):
    return re.sub('[^A-Za-z0-9]', '', s)

def hmac_sha256(msg, key):
    return hmac.new(key, msg, hashlib.sha256).digest()

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print >>sys.stderr, 'usage: macguffin DOMAIN'
        sys.exit(1)

    domain = sys.argv[1]
    key = getpass.getpass('Passphrase: ')

    print alnum(base64.b64encode(hmac_sha256(domain, key)))[:8]
