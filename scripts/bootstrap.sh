#!/usr/bin/env bash
set -euo pipefail

echo "Project: $(pwd)"
echo "Node: $(node -v)"
echo "npm: $(npm -v)"

npm install

echo
echo "Ready."
echo "Next commands:"
echo "  npm run dev"
echo "  npm run lint"
echo "  npm run build"
