'use strict';

var app = app || {};
var __API_URL__ = 'http://localhost:3000';

const platformIdNameList = {
  4: 'Playstation',
  5: 'Wii',
  6: 'PC',
  7: 'Nintendo 64',
  8: 'Playstation 2',
  9: 'Playstation 3',
  10: '',
  11: '',
  12: 'XBOX 360',
  13: 'PC (DOS)',
  14: 'Mac',
  15: 'Commodore C-64',
  16: 'Amiga',
  17: '',
  18: 'Nintendo Entertainment System (NES)',
  19: '',
  20: 'Nintendo DS',
  21: 'GameCube',
  22: 'Game Boy Color',
  23: 'DreamCast',
  24: 'Game Boy Advance',
  25: '',
  26: 'ZX Spectrum',
  27: '',
  28: '',
  29: 'Sega Genesis',
  30: '',
  31: 
  32: 'Sega Saturn',
  33: 'Game Boy',
  34: 'Android',
  35: 'Sega Game Gear',
  36: 'Xbox Live Arcade',
  37: '',
  38: 'PlayStation Portable (PSP)',
  39: 'iOS',
  40: '',
  41: 'Wii U',
  42: '',
  43: '',
  44: '',
  45: 'PlayStation Network (PSN)',
  46: 'PlayStation Vita',
  47: '',
  48: 'PlayStation 4',
  49: 'XBOX One',
  50: '3DO',
  51: '',
  52: 'Arcade',
  53: '',
  54: '',
  55: '',
  56: '',
  57: '',
  58: '',
  59: 'Atari 2600',
  60: '',
  61: 'Atari Lynx',
  62: 'Atari Jaguar',
  63: 'Atari ST/STE',
  64: 'Sega Master System',
  65: 'Atari 8-bit',
  66: 'Atari 5200',
  67: '',
  68: '',
  69: '',
  70: '',
  71: 'Commodore VIC-20',
  72: 'Virtual Console (Nintendo)',
  73: '',
  74: 'Windows Phone',
  75: '',
  76: '',
  77: '',
  78: 'Sega CD',
  79: 'Neo Geo MVS',
  80: 'Neo Geo AES',
  81: '',
  82: '',
  83: '',
  84: '',
  85: '',
  86: 'TurboGrafx-16',
  87: 'Virtual Boy',
  88: '',
  89: '',
  90: '',
  91: '',
  92: '',
  93: '',
  94: '',
  95: '',
  96: '',
  97: '',
  98: '',
  99: '',
  100: '',
  101: '',
  102: '',
  103: '',
  104: '',
  105: '',
  106: '',
  107: '',
  108: '',
  109: '',
  110: '',
  111: '',
  112: '',
  113: '',
  114: '',
  115: '',
  116: '',
  117: '',
  118: '',
  119: '',
  120: 'Neo Geo Pocket Color',
  121: '',
  122: '',
  123: '',
  124: '',
  125: '',
  126: '',
  127: '',
  128: '',
  129: 'Texas Instruments TI-99',
  130: 'Nintendo Switch',
  131: '',
  132: '',
  133: '',
  134: '',
  135: '',
  136: '',
  137: 'Nintendo 3DS',
  138: '',
  139: '',
  140: '',
  141: '',
  142: '',
  143: '',
}







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