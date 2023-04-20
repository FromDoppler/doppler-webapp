#!/bin/sh

# Stop script on NZEC
set -e
# Stop script if unbound variable found (use ${var:-} if intentional)
set -u

# Lines added to get the script running in the script path shell context
# reference: http://www.ostricher.com/2014/10/the-right-way-to-get-the-directory-of-a-bash-script/
cd "$(dirname "$0")"

# To avoid issues with MINGW y Git Bash, see:
# https://github.com/docker/toolbox/issues/673
# https://gist.github.com/borekb/cb1536a3685ca6fc0ad9a028e6a959e3
export MSYS_NO_PATHCONV=1
export MSYS2_ARG_CONV_EXCL="*"

# build production package and generate version number

#docker build --tag webapp_sources:current --target test -f Dockerfile.swarm .
#docker run --rm \
#    -e GH_TOKEN \
#    -e "NPM_TOKEN=00000000-0000-0000-0000-000000000000" \
#    -v `pwd`/.git:/app/.git \
#    webapp_sources:current \
#    /bin/sh -c "\
#        yarn semantic-release \
#    "

echo "Moved to doppler-jenkins-ci.groovy ..."
