'use strict';

var app = app || {};

var __API_URL__ = 'https://gameup.herokuapp.com';


(function(module) {

  $( '.details-button' ).click(function(){
    $('.summary').toggleClass('expandSummary');
  });

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
  
  let newID;

  Game.loadAll = rows => Game.all = rows.map(game => new Game(game));

  Game.createGame = newGame =>
    $.post(`${__API_URL__}/games`, newGame)
      .catch(errorCallback);

  Game.createRecord = newRecord =>
    $.post(`${__API_URL__}/userGames`, newRecord)
      .catch(errorCallback);

  Game.createUser = newUser =>
    $.post(`${__API_URL__}/users`, newUser)
      .catch(errorCallback);

  Game.storeUserInfo = (username) =>
    $.get(`${__API_URL__}/users?username=${username}`)
      .then(results => newID = results[0].user_id)
      .then(newID => localStorage.setItem('user_id', JSON.stringify(newID)))
      .then(()=> page('/'))
      .catch(errorCallback);

  // Game.update = (game, gameId) =>
  //   $.ajax({
  //     url: `${__API_URL__}/api/v1/games/${gameId}`,
  //     method: 'PUT',
  //     data: game,
  //   })
  //     .then(() => page(`/games/${gameId}`))
  //     .catch(errorCallback)

  // Game.destroy = (deleteGame) =>
  //   $.ajax({
  //     url: `${__API_URL__}/userGames?user_id=${deleteGame.user_id}&game_id=${deleteGame.game_id}`,
  //     method: 'DELETE',
  //   })
  //     .then(() => page('/mygames'))
  //     .catch(errorCallback)

  Game.searchResults = (gameSearch, callback) =>
    $.get(`${__API_URL__}/api/v1`, gameSearch)
      .then(Game.loadAll)
      .then(callback)
      .catch(errorCallback);


  module.Game = Game;
})(app)
