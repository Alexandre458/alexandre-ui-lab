#!/usr/bin/env bash
set -euo pipefail

sha="${1:-}"
if [[ ! "$sha" =~ ^[a-f0-9]{40}$ ]]; then
  echo "SHA inválido" >&2
  exit 2
fi

app_root="/var/lib/docker/volumes/nginx-proxy-manager_npm_data/_data/ui-lab"
release="$app_root/releases/$sha"
if [[ ! -f "$release/index.html" || ! -f "$release/404.html" || ! -d "$release/_next/static" ]]; then
  echo "Artefato estático incompleto" >&2
  exit 3
fi

previous=""
if [[ -L "$app_root/current" ]]; then
  previous="$(readlink "$app_root/current")"
fi

ln -s "releases/$sha" "$app_root/.current-next"
mv -Tf "$app_root/.current-next" "$app_root/current"

healthy=false
for attempt in 1 2 3 4 5; do
  if curl --fail --silent --show-error --max-time 10 https://ui.alexandresilva.dev/ -o /dev/null && \
     curl --fail --silent --show-error --max-time 10 "https://ui.alexandresilva.dev/buttons/confirmation-button/" -o /dev/null; then
    healthy=true
    break
  fi
  sleep 2
done

if [[ "$healthy" != true ]]; then
  if [[ -n "$previous" ]]; then
    ln -s "$previous" "$app_root/.current-rollback"
    mv -Tf "$app_root/.current-rollback" "$app_root/current"
  else
    unlink "$app_root/current"
  fi
  echo "Health check falhou; release anterior restaurada" >&2
  exit 4
fi

echo "Release $sha ativa e saudável"
