/* @flow */

function foo(x) {
    return x * 10;
}

foo("a");

[ 2,1,3,4 ].sort(function (a,b) {
    // return a === b;
    return b - a;
});
