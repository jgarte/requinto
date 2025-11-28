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
