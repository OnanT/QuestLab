#!/usr/bin/env bash
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 <password>"
  exit 1
fi

PASSWORD="$1"

python3 <<'EOF'
from passlib.context import CryptContext
import sys

pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto"
)

password = sys.argv[1]
print(pwd_context.hash(password))
EOF
"$PASSWORD"
