"use strict";

var integer = process.argv[2],

    uint32Array = new Uint32Array(1),
    uint16Array;

uint32Array[0] = integer;
uint16Array = new Uint16Array(uint32Array.buffer);

console.log(JSON.stringify(uint16Array));