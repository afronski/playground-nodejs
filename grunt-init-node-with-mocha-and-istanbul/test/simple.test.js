"use strict";

var simple = require("../lib/simple");

describe("Simple", function() {
  describe("Simple test", function() {
    it("should return 'simple' invoked", function() {
      simple.simple().should.be.eql("simple");
    });
  });
});