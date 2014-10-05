"use strict";

function loadUsers(userIdentificators, load, done) {
  var users = [],
      amount = userIdentificators.length,
      count = 0;

  function handleUserLoaded(index, user) {
    users[index] = user;
    ++count;

    if (count >= amount) {
      done(users);
    }
  }

  userIdentificators.forEach(function(identificator, index) {
    load(identificator, handleUserLoaded.bind(null, index));
  });
}

module.exports = loadUsers;