'use strict';

page('/', () => app.gameView.initSearchForm());

page('/mygames', () => app.myGamesView.getUserInfo());


page();