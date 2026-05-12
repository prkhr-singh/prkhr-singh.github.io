#!/bin/zsh
set -euo pipefail

cd /Users/singh.prakhar/vibe_analysis/home-purchase
exec /opt/homebrew/bin/python3 -m http.server 8787 --bind 127.0.0.1

