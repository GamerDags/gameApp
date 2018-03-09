'use strict';

var app = app || {};
var __API_URL__ = 'http://localhost:3000';

(function (module) {
  $('.nav-menu').on('click', function(event) {
    $('.nav-menu').slideToggle(350);
  });

  function reset() {
    $('.container').hide();
    $('.nav-menu').slideUp(350);
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
  }

  MyGames.all = [];

  MyGames.loadAll = rows => MyGames.all = rows.map(game => new MyGames(game));

  MyGames.fetchMyGames = (user_id) =>
    $.get(`${__API_URL__}/mygames?username=${user_id}`)
      .then(MyGames.loadAll)
      .then(myGamesView.initMyGames())
      .catch(app.errorCallback);

  function getUserInfo() {
    if (localStorage.username && localStorage.user_id) {
      user_id = JSON.parse(localStorage.getItem(user_id));
      username= JSON.parse(localStorage.getItem(username));
      
      MyGames.fetchMyGames(user_id);
    } else {
      logIn();
    }
  }

  function logIn() {
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
    MyGames.fetchMyGames();

    MyGames.all.map(game =>$('#myGames-list').append(game.toHtml()));
  };

  getUserInfo();
  module.myGamesView = myGamesView;
})(app);




//   // myListView.initListView = function (ctx, next) {
//   //   $('.nav-menu').slideUp(350);
//   //   $('.admin-view').show();

//   //   $('#admin-form').on('submit', function (event) {
//   //     event.preventDefault();
//   //     let token = event.target.passphrase.value;

//   // Do we need this/ { token })
//   $.get('https://api-2445582011268.apicast.io/games', { token })
//     .then(res => {
//       localStorage.token = true;
//       page('/');
//     })
//     .catch(() => page('/'));
// })
//   };

