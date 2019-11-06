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
environments="int qa production"

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

echo Publishing to Docker and Akamai...
echo pkgName: $pkgName
echo cdnBaseUrl: $cdnBaseUrl
echo versionPatch: $versionPatch
echo versionFull: $versionFull
echo pkgVersion: $pkgVersion
echo pkgBuild: $pkgBuild
echo pkgCommitId: $pkgCommitId

# Force pull the latest image version due to the cache not always is pruned immediately after an update is uploaded to docker hub
docker pull dopplerrelay/doppler-relay-akamai-publish

# TODO: Remove these steps in favor of publishing to `fromdoppler` organization.
for environment in ${environments}; do
    echo Publishing ${environment}...

    # TODO: It could break concurrent deployments with different docker accounts
    # It is inside the loop to mitigate collisions
    docker login -u="$DOCKER_WEBAPP_USERNAME" -p="$DOCKER_WEBAPP_PASSWORD"

    docker build --pull \
        -t darosw/doppler-webapp:$environment \
        -t darosw/doppler-webapp:$environment-$versionMayor \
        -t darosw/doppler-webapp:$environment-$versionMinor \
        -t darosw/doppler-webapp:$environment-$versionPatch \
        -t darosw/doppler-webapp:$environment-$versionFull \
        --build-arg environment=$environment \
        --build-arg cdnBaseUrl=$cdnBaseUrl \
        --build-arg pkgVersion=$pkgVersion \
        --build-arg versionFull=$versionFull \
        --build-arg pkgBuild=$pkgBuild \
        --build-arg pkgCommitId=$pkgCommitId \
        --build-arg cdn_hostname=$AKAMAI_CDN_HOSTNAME \
        --build-arg cdn_username=$AKAMAI_CDN_USERNAME \
        --build-arg cdn_password=$AKAMAI_CDN_PASSWORD \
        --build-arg cdn_cpcode=$AKAMAI_CDN_CPCODE \
        -f Dockerfile.RELEASES \
        .

    docker push darosw/doppler-webapp:$environment
    docker push darosw/doppler-webapp:$environment-$versionMayor
    docker push darosw/doppler-webapp:$environment-$versionMinor
    docker push darosw/doppler-webapp:$environment-$versionPatch
    docker push darosw/doppler-webapp:$environment-$versionFull
done
