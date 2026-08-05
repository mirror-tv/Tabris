#!/usr/bin/env bash
# set -eo pipefail

if [ "$PROXY_AMP" = "true" ]
then
  # run next.js together with proxy server
  PORT=$PROXIED_SERVER_PORT node server.js -p $PROXIED_SERVER_PORT &
  node amp-proxy-server.js &
else
  node server.js &
fi

# Exit immediately when one of the background processes terminate.
wait -n
