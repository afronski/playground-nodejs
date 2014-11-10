#!/bin/bash

curl -X PUT http://127.0.0.1:5984/couchdbschool
curl -X PUT http://127.0.0.1:5984/couchdbschool/robert -d '{ "type": "human" }'
