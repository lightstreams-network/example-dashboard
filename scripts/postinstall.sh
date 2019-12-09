#!/usr/bin/env bash


echo "Creating symbolic links to compiled contracts..."
rm -rf ./node_modules/@contracts
ln -nsf ../build/contracts ./node_modules/@contracts