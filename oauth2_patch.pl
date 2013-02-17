#!/usr/bin/perl
use strict;
use warnings;
use File::Temp qw(tempfile);

my $patch = <<'EOS';
--- /Users/yohei/node_modules/oauth/lib/oauth2.js	2012-07-28 21:46:01.000000000 +0900
+++ node_modules/passport-oauth/node_modules/oauth/lib/oauth2.js	2013-02-17 16:02:26.000000000 +0900
@@ -115,8 +115,8 @@
 
 exports.OAuth2.prototype.getOAuthAccessToken= function(code, params, callback) {
   var params= params || {};
-  params['client_id'] = this._clientId;
-  params['client_secret'] = this._clientSecret;
+  //params['client_id'] = this._clientId;
+  //params['client_secret'] = this._clientSecret;
   params['type']= 'web_server';
   var codeParam = (params.grant_type === 'refresh_token') ? 'refresh_token' : 'code';
   params[codeParam]= code;
@@ -124,6 +124,7 @@
   var post_data= querystring.stringify( params );
   var post_headers= {
        'Content-Type': 'application/x-www-form-urlencoded'
+     , 'Authorization': "Basic " + new Buffer(this._clientId + ":" + this._clientSecret).toString('base64')
    };
 
 
EOS
my ($fh, $patchfile) = tempfile();
print $fh $patch;
close($fh);
`patch -f node_modules/passport-oauth/node_modules/oauth/lib/oauth2.js < $patchfile`;
