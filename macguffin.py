#!/usr/bin/python

import sys
import re
import base64
import hashlib
import hmac
import getpass

def first8(s):
    return re.sub('[^A-Za-z0-9]', '', s)[:8]

def b64hmac(msg, key):
    return base64.b64encode(hmac.new(key, msg, hashlib.sha256).digest())

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print >>sys.stderr, 'usage: macguffin HOSTNAME'
        sys.exit(1)

    hostname = sys.argv[1]
    key = getpass.getpass('Passphrase: ')

    print first8(b64hmac(hostname, key))
