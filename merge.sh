#!/bin/sh

git checkout main
git pull origin main
git push
git pull origin work-FE
git push
git checkout work-FE
git pull origin main
git push
git checkout main
