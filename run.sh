#!/usr/bin/env bash

# throw error if failed
set -o errexit -o nounset

# sourcing nvm
NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" >/dev/null 2>&1

# switch to correct node version
if command -v nvm &> /dev/null; then
  NVM_NODE_VERSION=$(cat .nvmrc)
  CURRENT_NODE=$(node -v | sed 's/v//')

  if [ "$CURRENT_NODE" != "$NVM_NODE_VERSION" ]; then
    nvm install "$NVM_NODE_VERSION" >&2
    nvm use "$NVM_NODE_VERSION" >&2
  fi
else
  echo "warning: nvm not found. make sure node >=24 is installed." >&2
fi

# install dep
if [ ! -d "node_modules" ]; then
  echo "installing dependencies..." >&2
  npm install >&2
fi

# settings can be override via env var
HOT_RELOAD=${HOT_RELOAD:-true}

if [ "$HOT_RELOAD" = "true" ]; then
  echo "running with hot reload" >&2
  npx tsx watch src/index.ts
else
  npx tsx src/index.ts
fi
