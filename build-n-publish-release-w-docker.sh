#!/bin/sh

# IMPORTANT: `describe --tags` takes de first tag aphabetically, so
# if there are more than a tag in a commit, we do not know if it is
# the right version.
# If we could use annotated tags, `--tags` modifier is not necessary
# and it always takes the most recent one.
versionFull=${1:-$(git describe --tags --exact-match --match "v?*.?*.?*")}
pkgBuild=${2:-0}
pkgName="doppler-webapp"
cdnBaseUrl=${3:-"//cdn.fromdoppler.com/$pkgName"}
pkgCommitId=${4:-$(git rev-parse HEAD)}
pkgVersionQaPrefix="qa-"
pkgVersionIntPrefix="int-"
pkgVersionDevelopmentPrefix="dev-"
versionPatch="$(echo $versionFull | cut -d'-' -f1)" # v0.0.0 (ignoring `-` if exists)
versionMayor="$(echo $versionPatch | cut -d'.' -f1)" # v0
versionMinor="$versionMayor.$(echo $versionPatch | cut -d'.' -f2)" # v0.0

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

# TODO: generate and push docker images

# Consider using complete version ($versionFull, with text after -) or only patch vewrsion ($versionPatch, as now)
# or even minor version, so fixes will always be applied
pkgVersion=$versionPatch

echo Publishing to Akamai...
echo pkgName: $pkgName
echo cdnBaseUrl: $cdnBaseUrl
echo versionPatch: $versionPatch
echo versionFull: $versionFull
echo pkgVersion: $pkgVersion
echo pkgBuild: $pkgBuild
echo pkgCommitId: $pkgCommitId

# Force pull the latest image version due to the cache not always is pruned immediately after an update is uploaded to docker hub
docker pull dopplerrelay/doppler-relay-akamai-publish

sh ./build-w-docker.sh $pkgVersion $cdnBaseUrl production $versionFull $pkgBuild $pkgCommitId
docker run --rm \
    -e AKAMAI_CDN_HOSTNAME \
    -e AKAMAI_CDN_USERNAME \
    -e AKAMAI_CDN_PASSWORD \
    -e AKAMAI_CDN_CPCODE \
    -e "PROJECT_NAME=$pkgName" \
    -e "VERSION_NAME=$pkgVersion" \
    -v `pwd`/build:/source \
    dopplerrelay/doppler-relay-akamai-publish

sh ./build-w-docker.sh $pkgVersion $cdnBaseUrl qa $versionFull $pkgBuild $pkgCommitId
docker run --rm \
    -e AKAMAI_CDN_HOSTNAME \
    -e AKAMAI_CDN_USERNAME \
    -e AKAMAI_CDN_PASSWORD \
    -e AKAMAI_CDN_CPCODE \
    -e "PROJECT_NAME=$pkgName" \
    -e "VERSION_NAME=$pkgVersionQaPrefix$pkgVersion" \
    -v `pwd`/build:/source \
    dopplerrelay/doppler-relay-akamai-publish

sh ./build-w-docker.sh $pkgVersion $cdnBaseUrl int $versionFull $pkgBuild $pkgCommitId
docker run --rm \
    -e AKAMAI_CDN_HOSTNAME \
    -e AKAMAI_CDN_USERNAME \
    -e AKAMAI_CDN_PASSWORD \
    -e AKAMAI_CDN_CPCODE \
    -e "PROJECT_NAME=$pkgName" \
    -e "VERSION_NAME=$pkgVersionIntPrefix$pkgVersion" \
    -v `pwd`/build:/source \
    dopplerrelay/doppler-relay-akamai-publish

sh ./build-w-docker.sh $pkgVersion $cdnBaseUrl development $versionFull $pkgBuild $pkgCommitId
docker run --rm \
    -e AKAMAI_CDN_HOSTNAME \
    -e AKAMAI_CDN_USERNAME \
    -e AKAMAI_CDN_PASSWORD \
    -e AKAMAI_CDN_CPCODE \
    -e "PROJECT_NAME=$pkgName" \
    -e "VERSION_NAME=$pkgVersionDevelopmentPrefix$pkgVersion" \
    -v `pwd`/build:/source \
    dopplerrelay/doppler-relay-akamai-publish
