#!/bin/bash

curl -X PUT http://127.0.0.1:5984/programming-languages-learn-couchdb/_design/languages --data-binary @03-introduction-to-reduce.json
