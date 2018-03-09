'use strict';

var app = app || {};
var __API_URL__ = 'http://localhost:3000';

(function (module) {

  function reset() {
    $('.container').hide();
    $('.nav-dropdown').removeClass('expand');
    $('.hamburger').removeClass('no-btn');
  }

  const myGamesView = {};

  let user_id;
  let username;
  let newUser = {};

  function MyGames(rawGameObj) {
    Object.keys(rawGameObj).forEach(key => this[key] = rawGameObj[key]);
  }

  MyGames.prototype.toHtml = function() {
    let template = Handlebars.compile($('#game-list-template').text());
    return template(this);
  };

  MyGames.all = [];

  MyGames.loadAll = rows => MyGames.all = rows.map(game => new MyGames(game));

  MyGames.fetchMyGames = (user_id) =>
    $.get(`${__API_URL__}/mygames?user_id=${user_id}`)
      .then(MyGames.loadAll)
      .then(myGamesView.initMyGames())
      .catch(app.errorCallback);

  myGamesView.getUserInfo = function() {
    if (localStorage.username && localStorage.user_id) {
      user_id = JSON.parse(localStorage.user_id);
      user_id = parseInt(user_id);
      username= JSON.parse(localStorage.getItem(username));
      console.log(user_id);
      MyGames.fetchMyGames(user_id);
    } else {
      logIn();
    }
  };

  function logIn() {
    reset();
    $('.login-form').show();

    $('.login-form').on('submit', function(event){
      event.preventDefault();
      username = event.target.userName.value;
      console.log(username);
      localStorage.setItem('username', JSON.stringify(username));
      newUser = {newUser: username};
      console.log(newUser);
      app.Game.createUser(newUser)
        .then(module.Game.storeUserInfo(username));
      // .then(getUserInfo(username));
    });
  }

  myGamesView.initMyGames = function() {
    reset();
    $('.myGames').show();
    $('#myGames-list').empty();

    MyGames.all.map(game =>$('#myGames-list').append(game.toHtml()));
  };

  myGamesView.getUserInfo();
  module.MyGames = MyGames;
  module.myGamesView = myGamesView;
})(app);