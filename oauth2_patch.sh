#!/bin/sh
patch -f node_modules/passport-oauth/node_modules/oauth/lib/oauth2.js < ./oauth2.diff
