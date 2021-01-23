#!/usr/bin/env bash

pushd .git/hooks
echo "Installing hooks..."
# this command creates symlink to our pre-commit script
ln -sv ../../scripts/pre-commit.js pre-commit
ln -sv ../../scripts/pre-push.js pre-push
ln -sv ../../scripts/commit-msg.js commit-msg
echo "Done!"
popd
