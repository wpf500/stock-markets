#!/bin/bash

wget -O data/$(date -u "+%FT%H-%M").json $(cat url.txt)
