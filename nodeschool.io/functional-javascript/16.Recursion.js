"use strict";

function unique(array) {
  return array.reduce(function(result, actual) {
    if (result.indexOf(actual) === -1) {
      result.push(actual);
    }

    return result;
  }, []);
}

function traverseTree(tree, result) {
  if (typeof(tree) === "object") {
    Object.keys(tree).forEach(function(dependency) {
      result.push(dependency + "@" + tree[dependency].version);
      result = traverseTree(tree[dependency].dependencies, result);
    });
  }

  return result;
}

function getDependencies(tree) {
  return unique(traverseTree(tree.dependencies, []).sort());
}

module.exports = getDependencies;