#!/bin/sh

pkgName="doppler-webapp"
pkgVersion=${1:-"v0.0.0-build0"}
cdnBaseUrl=${2:-"//cdn.fromdoppler.com/$pkgName"}
pkgBuild=${4:-0}
pkgCommitId=${5:-$(git rev-parse HEAD)}
environments="int qa development production"

# Exit immediately if a command exits with a non-zero status.
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

echo Publishing to Docker and Akamai...
echo pkgName: $pkgName
echo cdnBaseUrl: $cdnBaseUrl
echo pkgVersion: $pkgVersion
echo pkgBuild: $pkgBuild
echo pkgCommitId: $pkgCommitId

# Force pull the latest image version due to the cache not always is pruned immediately after an update is uploaded to docker hub
docker pull dopplerrelay/doppler-relay-akamai-publish

for environment in ${environments}; do
    echo Publishing ${environment}...

    if test "$environment" = "production";
    then  
        env_version=$pkgVersion;
    else
        env_version=$environment-$pkgVersion;
    fi

    echo deploying into $env_version folder ...

    docker build --pull \
        --build-arg environment=$environment \
        --build-arg env_version=$env_version \
        --build-arg cdn_hostname=$AKAMAI_CDN_HOSTNAME \
        --build-arg cdn_username=$AKAMAI_CDN_USERNAME \
        --build-arg cdn_password=$AKAMAI_CDN_PASSWORD \
        --build-arg cdn_cpcode=$AKAMAI_CDN_CPCODE \
        -f Dockerfile.BUILDS_AND_CDN \
        .

done
