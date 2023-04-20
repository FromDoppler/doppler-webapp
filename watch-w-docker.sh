#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Lines added to get the script running in the script path shell context
# reference: http://www.ostricher.com/2014/10/the-right-way-to-get-the-directory-of-a-bash-script/
cd "$(dirname "$0")"

export MSYS_NO_PATHCONV=1
export MSYS2_ARG_CONV_EXCL="*"

# -e CHOKIDAR_USEPOLLING=true \ --> hot reload, beware of CPU usage
docker run --rm \
    -p 3000:3000 \
    -v "$(pwd)":/work \
    -w /work \
    -e CHOKIDAR_USEPOLLING=true \
    node:12.16.1 \
    /bin/sh -c "\
        yarn \
        && yarn start \
    "
