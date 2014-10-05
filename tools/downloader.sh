#!/bin/bash

while read -r line
do
  set -- $line
  wget -O "$1" "$2"
done < urls.txt