#!/bin/sh

pkgVersion=${1:-"v0.0.0-build0"}
cdnBaseUrl=${2:-"//cdn.fromdoppler.com/$pkgName"}
environment=${3:-"production"}
versionFull=${4:-$pkgVersion}
pkgBuild=${5:-0}
pkgCommitId=${6:-0}

# Exit immediately if a command exits with a non-zero status.
set -e

# Lines added to get the script running in the script path shell context
# reference: http://www.ostricher.com/2014/10/the-right-way-to-get-the-directory-of-a-bash-script/
cd $(dirname $0)

export MSYS_NO_PATHCONV=1
export MSYS2_ARG_CONV_EXCL="*"

docker run --rm \
    -v `pwd`:/work \
    -w /work \
    node:15.14.0 \
    /bin/sh -c "\
        yarn \
        && yarn run build:$environment \
        && printf \"$cdnBaseUrl\n$environment\n$pkgVersion\n$versionFull\nbuildNo$pkgBuild\n$pkgCommitId\" > build/version.txt \
    "
