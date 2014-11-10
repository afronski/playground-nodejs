#!/bin/bash

curl -X PUT http://127.0.0.1:5984/things-learn-couchdb/_design/thingsMadeOfMetal --data-binary @02-using-map-in-views.json
