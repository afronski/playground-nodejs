"use strict";

// Compatible with io.js only (node.js 0.10.x does not have `for..of`).
//
// Unfortunately, V8 does not have spread operator yet, 
// so this magic is unavailable for us for now:
//
//   let union = new Set([ ...a, ...b ]);
//   let intersection = new Set([ ...a ].filter(x => b.has(x)));
//   let difference = new Set([ ...a ].filter(x => !b.has(x)));

let a = new Set([ 1, 2, 3 ]);
let b = new Set([ 4, 3, 2 ]);

let union = new Set();

for(let element of a) {
    union.add(element);
}

for(let element of b) {
    union.add(element);
}

for(let element of union) {
    console.log("Union element: %s.", element);
}
