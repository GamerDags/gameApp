'use strict';

// Application dependencies
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser').urlencoded({extended: true});
const superagent = require('superagent');
// const igdb = require('igdb-api-node').default;

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL;
const DATABASE_URL = process.env.DATABASE_URL;
const API_KEY = 'd5f8b5029dfc0e40ac54647a962a9e42';

const client = new pg.Client(DATABASE_URL);
client.connect();

//Application Middleware
app.use(cors());
app.use(express.static('./public'));

//API Endpoints
app.get('/'), (req, res) => {
  res.sendFile('index.html', {root: './public'});
};


app.get('/api/v1', (req, res) => {

  let query = '';
  //add query values from homepage form

  // if(req.query.age) query += `&filter[esrb.rating][eq]=${req.query.age}`;
  // if(req.query.genres) query += `&filter[genres][eq]=${req.query.genres}`;
  if(req.query.ratings) query += `&filter[total_rating_count][lte]=${req.query.ratings}&order=total_rating_count:desc`;
  if(req.query.score && req.query.score < 76) query += `&filter[rating][lte]=${req.query.score}`;
  if(req.query.score && req.query.score > 75) query += `&filter[rating][gte]=${req.query.score}`;
  // if(req.query.yearRange) query += `&filter[first_release_date][lte]=${req.query.yearRange}`;
  // if(req.query.platforms) query += `&filter[platforms][in]=${req.query.platforms}`;

  //set URL for API query
  let url = `https://api-2445582011268.apicast.io/games/?fields=name,genres,platforms,esrb.rating,first_release_date,cover,total_rating_count,summary${query}&limit=25&offset=0`;
  console.log (url);

  //get request from API
  superagent.get(url)
    .set({'user-key': API_KEY})
    .then(response => response.body.map((games) => {

      let { name, genres, platforms, esrb, first_release_date, cover, summary, id } = games;

      let placeholderImage = 'img/nocover.jpg';

      // console.log(games.cover);
      return {
        title: name ? name : 'No title available',
        genres: genres ? genres[0] : 'No genres available',
        platforms: platforms ? platforms : 'No platforms available',
        esrb: esrb ? esrb.rating : 'No rating available',
        first_release_date: first_release_date ? first_release_date : 'No date available',
        cover_url: games.cover.cloudinary_id ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${games.cover.cloudinary_id}.jpg`: placeholderImage,
        summary: summary ? summary : 'No description available',
        game_id: id ? id : ''

      };
    }))
    //.then(console.log)
    .then(game => res.send(game))
    .catch(console.error);
});

//load list of games based on userID
app.get('/mygames', (req, res) => {
  console.log('hit loadMyGames');
  client.query(`SELECT * FROM games JOIN userGames ON games.game_id = userGames.game_id WHERE userGames.user_id = ${req.query.user_id};`)
    .then(results => res.send(results.rows))
  // .then(console.log);
    .catch(console.error);
});

//DONE fetch user info based on password username
app.get('/users', (req,res) => {
  console.log(req.query.username);
  client.query(`SELECT user_id FROM users WHERE username='${req.query.username}';`)
    .then(result => res.send(result.rows))
    // .then(console.log)
    .catch(console.error);
});

app.post('/users', bodyParser, (req,res) => {
  let {newUser} = req.body;
  console.log(req.body);
  client.query(`INSERT INTO users(username) VALUES ($1);`, [newUser])
    .then(results => res.send(201))
    .catch(console.error);
});

app.post('/games', bodyParser, (req,res) => {
  console.log('hit insertNewGame');
  let {game_id, title, genres, platforms, esrb, first_release_date, cover_url, summary} = req.body;
  client.query(`INSERT INTO games(game_id, title, genres, platforms, esrb, first_release_date, cover_url, summary) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
    [game_id, title, genres, platforms, esrb, first_release_date, cover_url, summary])
    .then(results => res.sendStatus(201))
    .catch(console.error);
});

app.post('/userGames', bodyParser, (req, res) => {
  console.log('hit postNewGame');
  let {user_id, game_id} = req.body;
  client.query('INSERT INTO userGames(user_id, game_id, played) VALUES ($1, $2, $3);', 
    [user_id, game_id, false])
    .then(()=> res.sendStatus(201))
    .catch(console.error);
});

// app.put('/mygames', bodyParser, (req, res) => {
//   console.log('hit gamePlayed');
//   let {played} = req.body;
//   client.query(`UPDATE userGames SET played=$1`,
//     [played])
//     .then(() => res.sendStatus(204))
//     .catch(console.error);
// });

// app.delete('/userGames', (req, res) => {
//   console.log('hit deleteMyGame');
//   client.query(`DELETE FROM userGames WHERE user_id=${req.body.user_id} AND game_id=${req.body.game_id};`)
//     .then(()=> res.sendStatus(204))
//     .catch(console.error);
// });

function loadGamesDB() {
  console.log('hit loadGamesDB');
  client.query(`
    CREATE TABLE IF NOT EXISTS
    games(
      table_id SERIAL,
      game_id INTEGER NOT NULL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      genres VARCHAR(255), 
      platforms VARCHAR(255), 
      esrb VARCHAR(255), 
      first_release_date VARCHAR(20), 
      cover_url VARCHAR(255), 
      summary TEXT
    );`
  )
    .catch(console.error);
}


function loadUserDB() {
  console.log('hit loadUserDB');
  client.query(`
    CREATE TABLE IF NOT EXISTS
    users(
      user_id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255)
    );`
  )
    .catch(console.error);
}

function userGamesDB() {
  console.log('hit userGamesDB');
  client.query(`
    CREATE TABLE IF NOT EXISTS
    userGames(
      game_id INTEGER NOT NULL REFERENCES games(game_id),
      user_id INTEGER NOT NULL REFERENCES users(user_id),
      played VARCHAR (20)
    );`
  )
    .catch(console.error);
}
loadGamesDB();
loadUserDB();
userGamesDB();

app.get('*', (req, res) => res.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
