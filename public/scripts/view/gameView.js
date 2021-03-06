'use strict';
var app = app || {};


(function(module) {

  $( '.nav-button' ).click(function(){
    $('.nav-dropdown').toggleClass('expand');
    $('.hamburger').toggleClass('no-btn');
  });


  function reset() {
    $('.container').hide();
    $('.nav-dropdown').hide();
    $('.nav-dropdown').removeClass('expand');
    $('.hamburger').removeClass('no-btn');
  }

  //app.user_id = JSON.parse(localStorage.getItem(user_id));

  const gameView = {};
  let newGame;
  let newRecord = {};
  let user_id;


  //initialize the search form
  gameView.initSearchForm = function() {
    reset();
    $('.form').show();

    $('.form').on('submit', function(event){
      event.preventDefault();

      //if statements checking for value
      // q1
      let ageValue = $('input:radio[name="q1"]:checked').val();
      console.log(ageValue + ' is age value');
      // q2.1

      let ratingsValue = $('input:radio[id="q2-1"]:checked').val() || '';
      console.log(ratingsValue + ' is ratings value');

      // if(q2-1 === true) {
      //   $('#q2-2'), $('#q2-3'), $('#q2-4'), $('#q2-5') === null
      // } else {
      let genreValue = $('input:radio[name="q2"]:checked').val() || '';
      console.log(genreValue + ' is genre value');
      // };
      //q2.2
      // q3
      let platformsValue = $('input:radio[name="q3"]:checked').val();
      console.log(platformsValue + ' is console value');
      // q4
      let yearRangeValue = $('input:radio[name="q4"]:checked').val();
      console.log(yearRangeValue + ' is year range');
      // q5
      let scoreValue = $('input:radio[name="q5"]:checked').val();
      console.log(scoreValue + ' is score value');


      let gameSearch = {
        age: ageValue || '',
        genres: genreValue || '',
        platforms: platformsValue || '',
        ratings: ratingsValue || '',
        score: scoreValue || '',
        yearRange: yearRangeValue || ''
      };
      console.log(gameSearch + ' is gameSearch value');
      module.Game.searchResults(gameSearch, gameView.initResultsPage);

      $('input').checked===false;
    });
  };

  gameView.initResultsPage = function() {
    reset();

    $('.search-results').show();
    $('#search-list').empty();

    module.Game.all.map(game =>$('#search-list').append(game.toHtml()));

    $( '.details-button' ).click(function(){
      $('.game-container').toggleClass('expandGame')
      $('.summary').toggleClass('expandSummary');
    });

    $('.add-game').on('click', function(event) {
      let selectedGame = parseInt(event.target.value);
      console.log(selectedGame);
      for(let i in app.Game.all){
        console.log(app.Game.all[i].game_id);
        if(app.Game.all[i].game_id === selectedGame){
          console.log(app.Game.all[i]+' is value of [i]');
          newGame = app.Game.all[i];
          console.log(newGame);
          // console.log(newGame);
        }
      }
      module.Game.createGame(newGame);
      user_id = JSON.parse(localStorage.user_id);
      user_id = parseInt(user_id);
      newRecord = {
        user_id: user_id,
        game_id: selectedGame
      };
      console.log(newRecord);
      module.Game.createRecord(newRecord);

    });
  };

  gameView.initAboutUs = function() {
    reset();
    $('.about-us').show();
  };

  module.gameView = gameView;

})(app);