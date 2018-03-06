'use strict';

var app = app || {};

(function(module) {

  $('.icon-menu').on('click', function(event) {
    $('.nav-menu').slideToggle(350);
  })

  function reset() {
    $('.container').hide();
    $('.nav-menu').slideUp(350);
  }

  const homeView = {};

  //initialize the search form
  homeView.initSearchForm = function() {
    reset();
    $('.form').show();
    
    $('.form').on('submit', function(event){
      event.preventDefault();

      //if statements checking for value

      // q1
      let ageValue = $('input:radio[name="q1"]:checked').val();
      console.log(ageValue + ' is age value');

      // q2.1
      let ratingsValue = $('input:radio[name="q2-1"]:checked').val() || '';
      console.log(ratingsValue + ' is ratings value');

      //q2.2
      let genreValue = $('input:radio[name="q2"]:checked').val() || '';
      console.log(genreValue + ' is genre value');
      
      // q3
      let consolesValue = $('input:radio[name="q3"]:checked').val();
      console.log(consolesValue + ' is console value');

      // q4
      let yearRangeValue = $('input:radio[name="q4"]:checked').val();
      console.log(yearRangeValue + ' is year range');

      // q5
      let scoreValue = $('input:radio[name="q5"]:checked').val();
      console.log(scoreValue + ' is score value');

      let gameSearch = {
        age: ageValue || '',
        genre: genreValue || '',
        consoles: consolesValue || '',
        ratings: ratingsValue || '',
        score: scoreValue || '',
        yearRange: yearRangeValue || ''
      };
      console.log(gameSearch + ' is gameSearch value');
      module.Game.searchResults(gameSearch, resultsView.initResultsPage);

      $('input').checked===false;
    })   
  }

  module.homeView = homeView;

})(app);