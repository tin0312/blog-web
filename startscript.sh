#!/usr/bin/env bash
cd ./blog-server
#yarn ## Need to to install dependencies on first lunch
rm -r ./clientbuild || true #remove previous build file

cd ../blog-client
#yarn ## Need to to install dependencies on first lunch
npm run build
mv ./build ../blog-server/clientbuild

cd ../blog-server

npm start