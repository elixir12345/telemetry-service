#!/bin/bash

echo "Enter your name:"
read name
echo "Enter the module/service you worked on:"
read module
echo "Enter a short comment:"
read comment

echo "$(date +%F),$(git rev-parse --short HEAD),$name,$module,$comment" >> version_log.csv

git add .
git commit -m "Added version log for $name"
git push

