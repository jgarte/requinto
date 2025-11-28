# Run the local development server. I installed this from nixpkgs.
serve:
    live-server --port=8000 --no-browser

# Run all the unit tests.
test:
    node --test

format:
    npx prettier --write *.js

build:
    flatpak-builder --user --install --force-clean build flatpak/social.whereis.requinto.json

install:
    flatpak run social.whereis.requinto

export:
    flatpak-builder build-dir flatpak/social.whereis.requinto.json --force-clean --repo=repo
    flatpak build-bundle repo requinto.flatpak social.whereis.requinto

phone:
    flatpak-builder build-dir flatpak/social.whereis.requinto.json \
      --force-clean \
      --arch=aarch64 \
      --repo=repo
