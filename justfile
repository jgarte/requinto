# Run the local development server (Python's built-in, no extra install).
serve:
    python3 -m http.server 8000 --directory src

# Run the global practice counter backend.
serve-api:
    node server.js

# Run all the unit tests.
test:
    node --test

format:
    npx prettier --write *.js
