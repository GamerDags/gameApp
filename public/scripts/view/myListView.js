'use strict';

var app = app || {};

(function (module) {
  const myListView = {};

  // myListView.initListView = function (ctx, next) {
  //   $('.nav-menu').slideUp(350);
  //   $('.admin-view').show();

  //   $('#admin-form').on('submit', function (event) {
  //     event.preventDefault();
  //     let token = event.target.passphrase.value;

  // Do we need this/ { token })
  $.get('https://api-2445582011268.apicast.io/games', { token })
    .then(res => {
      localStorage.token = true;
      page('/');
    })
    .catch(() => page('/'));
})
  };