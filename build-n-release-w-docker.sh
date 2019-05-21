#!/bin/sh

pkgName="doppler-webapp"
cdnBaseUrl=${2:-"//cdn.fromdoppler.com/$pkgName"}
pkgVersionQaPrefix="qa-"
pkgVersionIntPrefix="int-"
pkgVersionDevelopmentPrefix="dev-"

# Stop script on NZEC
set -e
# Stop script if unbound variable found (use ${var:-} if intentional)
set -u

# Lines added to get the script running in the script path shell context
# reference: http://www.ostricher.com/2014/10/the-right-way-to-get-the-directory-of-a-bash-script/
cd $(dirname $0)

# To avoid issues with MINGW y Git Bash, see:
# https://github.com/docker/toolbox/issues/673
# https://gist.github.com/borekb/cb1536a3685ca6fc0ad9a028e6a959e3
export MSYS_NO_PATHCONV=1
export MSYS2_ARG_CONV_EXCL="*"

# build production package and generate version number
docker run --rm \
    -v `pwd`:/work \
    -w /work \
    node:10 \
    /bin/sh -c "\
        yarn \
        && yarn semantic-release \
    "

# read pkgVersion from version.txt (see package.json => $.release.prepare[?(@.path=="@semantic-release/exec")])
pkgVersion=v$(cat build/version.txt)

echo Publishing to Akamai...
echo pkgName: $pkgName
echo pkgVersion: $pkgVersion
echo cdnBaseUrl: $cdnBaseUrl

# Force pull the latest image version due to the cache not always is pruned immediately after an update is uploaded to docker hub
docker pull dopplerrelay/doppler-relay-akamai-publish

docker run --rm \
    -e AKAMAI_CDN_HOSTNAME \
    -e AKAMAI_CDN_USERNAME \
    -e AKAMAI_CDN_PASSWORD \
    -e AKAMAI_CDN_CPCODE \
    -e "PROJECT_NAME=$pkgName" \
    -e "VERSION_NAME=$pkgVersion" \
    -v /`pwd`/build:/source \
    dopplerrelay/doppler-relay-akamai-publish

sh ./build-w-docker.sh $pkgVersion $cdnBaseUrl qa
docker run --rm \
    -e AKAMAI_CDN_HOSTNAME \
    -e AKAMAI_CDN_USERNAME \
    -e AKAMAI_CDN_PASSWORD \
    -e AKAMAI_CDN_CPCODE \
    -e "PROJECT_NAME=$pkgName" \
    -e "VERSION_NAME=$pkgVersionQaPrefix$pkgVersion" \
    -v /`pwd`/build:/source \
    dopplerrelay/doppler-relay-akamai-publish

sh ./build-w-docker.sh $pkgVersion $cdnBaseUrl int
docker run --rm \
    -e AKAMAI_CDN_HOSTNAME \
    -e AKAMAI_CDN_USERNAME \
    -e AKAMAI_CDN_PASSWORD \
    -e AKAMAI_CDN_CPCODE \
    -e "PROJECT_NAME=$pkgName" \
    -e "VERSION_NAME=$pkgVersionIntPrefix$pkgVersion" \
    -v /`pwd`/build:/source \
    dopplerrelay/doppler-relay-akamai-publish

sh ./build-w-docker.sh $pkgVersion $cdnBaseUrl development
docker run --rm \
    -e AKAMAI_CDN_HOSTNAME \
    -e AKAMAI_CDN_USERNAME \
    -e AKAMAI_CDN_PASSWORD \
    -e AKAMAI_CDN_CPCODE \
    -e "PROJECT_NAME=$pkgName" \
    -e "VERSION_NAME=$pkgVersionDevelopment$pkgVersion" \
    -v /`pwd`/build:/source \
    dopplerrelay/doppler-relay-akamai-publish
