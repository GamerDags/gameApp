'use strict';

var app = app || {};
var __API_URL__ = 'http://localhost:3000';

(function(module) {
  function errorCallback(err) {
    console.error(err);
    module.errorView.initErrorPage(err);
  }

  function Game(rawGameObj) {
    Object.keys(rawGameObj).forEach(key => this[key] = rawGameObj[key]);
  }

  Game.prototype.toHtml = function() {
    let template = Handlebars.compile($('#game-list-template').text());
    return template(this);
  }

  Game.all = [];

  Game.loadAll = rows => Game.all = rows.map(game => new Game(game));

  Game.searchResults = (gameSearch, callback) =>
    $.get(`${__API_URL__}/`, gameSearch)
      // .then(result => console.log(result))
      .then(Game.loadAll)
      .then(callback)
      .catch(errorCallback);


  module.Game = Game;
})(app)