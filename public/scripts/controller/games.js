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
  };

  Game.all = [];

  Game.loadAll = rows => Game.all = rows.map(game => new Game(game));
  Game.fetchAll = callback =>
    $.get(`${__API_URL__}/api/v1/games`)
      .then(Game.loadAll)
      .then(callback)
      .catch(errorCallback);

  Game.createGame = newGame =>
    $.post(`${__API_URL__}/games`, newGame)
      // .then(() => page('/games'))
      .catch(errorCallback);

  Game.createRecord = newRecord =>
    $.post(`${__API_URL__}/userGames`, newRecord)
      // .then(() => page('/games'))
      .catch(errorCallback);

  Game.update = (game, gameId) =>
    $.ajax({
      url: `${__API_URL__}/api/v1/games/${gameId}`,
      method: 'PUT',
      data: game,
    })
      .then(() => page(`/games/${gameId}`))
      .catch(errorCallback)

  Game.destroy = id =>
    $.ajax({
      url: `${__API_URL__}/api/v1/games/${id}`,
      method: 'DELETE',
    })
      .then(() => page('/'))
      .catch(errorCallback)

  Game.searchResults = (gameSearch, callback) =>
    $.get(`${__API_URL__}/`, gameSearch)
      // .then(result => console.log(result))
      .then(Game.loadAll)
      .then(callback)
      .catch(errorCallback);


  module.Game = Game;
})(app)