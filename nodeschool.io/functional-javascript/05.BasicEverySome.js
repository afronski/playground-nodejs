"use strict";

module.exports = function checkUsersValid(goodUsers) {
  return function(users) {
    return users.every(function(user) {
      return goodUsers.some(function(goodUser) {
        return user.id === goodUser.id;
      });
    });
  };
};