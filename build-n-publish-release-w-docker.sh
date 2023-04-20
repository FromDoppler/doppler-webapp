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
versionPatch="$(echo "$versionFull" | cut -d'-' -f1)" # v0.0.0 (ignoring `-` if exists)
environments="int qa production"

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

# TODO: generate and push docker images

# Consider using complete version ($versionFull, with text after -) or only patch vewrsion ($versionPatch, as now)
# or even minor version, so fixes will always be applied
pkgVersion=$versionPatch

echo Publishing to Docker
echo pkgName: $pkgName
echo cdnBaseUrl: "$cdnBaseUrl"
echo versionPatch: "$versionPatch"
echo versionFull: "$versionFull"
echo pkgVersion: "$pkgVersion"
echo pkgBuild: "$pkgBuild"
echo pkgCommitId: "$pkgCommitId"

# TODO: Remove these steps in favor of publishing to `fromdoppler` organization.
for environment in ${environments}; do
    echo Publishing "${environment}..."

    docker build --pull \
        --build-arg environment="$environment" \
        --build-arg cdnBaseUrl="$cdnBaseUrl" \
        --build-arg pkgVersion="$pkgVersion" \
        --build-arg versionFull="$versionFull" \
        --build-arg pkgBuild="$pkgBuild" \
        --build-arg pkgCommitId="$pkgCommitId" \
        --build-arg CDN_SFTP_PORT="$CDN_SFTP_PORT" \
        --build-arg CDN_SFTP_USERNAME="$CDN_SFTP_USERNAME" \
        --build-arg CDN_SFTP_HOSTNAME="$CDN_SFTP_HOSTNAME" \
        --build-arg CDN_SFTP_BASE="$CDN_SFTP_BASE" \
        --build-arg SSH_PRIVATE_KEY="$(cat ~/.ssh/id_rsa)" \
        --build-arg SSH_KNOWN_HOSTS="$(cat ~/.ssh/known_hosts)" \
        -f Dockerfile.RELEASES \
        .

done
