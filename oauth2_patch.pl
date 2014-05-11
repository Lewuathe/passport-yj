#!/usr/bin/perl
use strict;
use warnings;
use File::Temp qw(tempfile);

my $patch = <<'EOS';
@@ -147,8 +147,8 @@


EOS
my ($fh, $patchfile) = tempfile();
print $fh $patch;
close($fh);
`patch -f node_modules/passport-oauth/node_modules/oauth/lib/oauth2.js < $patchfile`;
