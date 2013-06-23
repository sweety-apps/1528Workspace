#!/bin/sh - 

GIT_PATH="/Applications/GitHub.app/Contents/Resources/git/bin/git";
WORKSPACE_PATH="/Users/leejustin/Documents/SourceCode/GitHub/1528Workspace";
GIT_REMOTE_URL="https://github.com/sweety-apps/1528Workspace.git";
GITHUB_USER_NAME="rocker.roller.justin.lee@gmail.com";
GITHUB_PSW="ff8143533";

cd ${WORKSPACE_PATH}

# Assigns the original repository to a remote called "upstream"
${GIT_PATH} remote add upstream ${GIT_REMOTE_URL}

# Fetches any new changes from the original repository
${GIT_PATH} fetch upstream

# Merges any changes fetched into your working files
${GIT_PATH} merge upstream/master

cd -
