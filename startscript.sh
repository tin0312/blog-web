#!/usr/bin/env bash

# Navigate to blog-server directory and install dependencies
cd ./blog-server
npm install # Install server dependencies
rm -r ./clientbuild || true # Remove previous build if it exists

# Navigate to blog-client, install dependencies, build, and move to blog-server
cd ../blog-client
npm install # Install client dependencies
npm run build # Build the client
mv ./build ../blog-server/clientbuild # Move the build to blog-server/clientbuild

# Go back to blog-server and start the server
cd ../blog-server
npm start