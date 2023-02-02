#!/bin/bash
sudo chown -R $USER:$USER ~/
mkdir -p ~/workspace && ln -s $(pwd) ~/workspace

# Use VSCode as terminal text editor
cat <<EOT >> ~/.bashrc
export EDITOR='code --wait'
EOT

# Install library
yarn install