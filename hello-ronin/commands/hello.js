var Command = require('ronin').Command;

var Hello = Command.extend({
  desc: 'Command that says hello',
  
  run: function () {
    console.log('Hello!');
  }
});

module.exports = Hello;
