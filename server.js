'use strict';


// Application dependencies
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser').urlencoded({extended: true});
const superagent = require('superagent');
const igdb = require('igdb-api-node').default;

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL;
const DATABASE_URL = process.env.DATABASE_URL;
const TOKEN = process.env.TOKEN;
const API_KEY = 'd5f8b5029dfc0e40ac54647a962a9e42';

const client = new pg.Client(DATABASE_URL);
client.connect();

//Application Middleware
app.use(cors());

//API Endpoints
app.get('/', (req, res) => {

  let query = '';
  //add query values from homepage form

  //if(req.query.name) query += `&filter[name][eq]=${req.query.name}`;
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
    //.then(res => console.log(res.body))//need to build from here
    .then(response => response.body.map((games) => {

      let { name, genres, platforms, esrb, first_release_date, cover, summary, id } = games;

      let placeholderImage = 'http://www.newyorkpaddy.com/images/covers/NoCoverAvailable.jpg';

      return {
        title: name ? name : 'No title available',
        genres: genres ? genres[0] : 'No genres available',
        platforms: platforms ? platforms : 'No platforms available',
        esrb: esrb ? esrb.rating : 'No rating available',
        first_release_date: first_release_date ? first_release_date : 'No date available',
        image_url: cover ? cover.smallThumbnail : placeholderImage,
        summary: summary ? summary : 'No description available',
        game_id: id ? id : ''

      };
    }))
    //.then(console.log)
    .then(game => res.send(game))
    .catch(console.error);
});

// let query = '&filter[rating][gte]=75&filter[genres][eq]=5';
// let url = `https://api-2445582011268.apicast.io/games/?fields=name,genres,platforms,esrb.rating,first_release_date${query}&limit=25`;
//   console.log (url); This one works don't touch.

// let query = '&filter[first_release_date][lt]=1104537600000&filter[rating][gte]=75&filter[genres][eq]=5';
// let url = `https://api-2445582011268.apicast.io/games/?fields=name,genres,platforms,esrb.rating,first_release_date${query}&limit=25`;
// console.log (url);

// let query = '&filter[first_release_date][gt]=1500619813000&filter[rating][gte]=75&filter[genres][eq]=5';
// let url = `https://api-2445582011268.apicast.io/games/?fields=name,genres,platforms,esrb.rating,first_release_date${query}&limit=25`;
//   console.log (url);  changing the 'gt'/'lt' in first_release_date will work in this.

// let query = '&filter[rating][gte]=75&filter[genres][eq]=5';
// let url = `https://api-2445582011268.apicast.io/release_dates/?fields=*&filter[platform][eq]=48&order=date:asc&filter[date][gt]=1500619813000&expand=game`;

//   console.log (url);
//  this works but the let url appears to adjust the date the games are filtered by, not the let query.

// let query = '&count?filter[release_dates.platform][eq]=72';
// let url = `https://api-2445582011268.apicast.io/games/?fields=name,genres,platforms,esrb.rating,release_dates${query}&limit=25`;
//   console.log (url);   trying to figur out filterin by date test 1.

//get request from API
// superagent.get(url)
//   .set({'user-key': API_KEY})
//   .then(res => console.log(res.body))//need to build from here
//   .catch(console.error);

//   let { name, genres, platforms, esrb.rating, first_release_date } = game.volumeInfo;

//   let placeholderImage = 
//   'http://www.newyorkpaddy.com/images/covers/NoCoverAvailable.jpg';

//   return {
//     name: name ? name : 'No title available',
//     genres: genres ? genres[0] : 'No genres available',
//     platforms: platforms ? platforms : 'No platforms available',
//     // esrb.rating: esrb.rating ? esrb.rating : 'No rating available',
//     first_release_date: first_release_date ? first_release_date : 'No date available',
//   }
// }))
// .then(game => res.send(game[0]))
// .catch(console.error)
// })

// app.get('https://api-2445582011268.apicast.io/games', (req, res) => {
//   let url = 'https://api-2445582011268.apicast.io/games/?fields=*${query}&limit=25&offset=0';
//   superagent.get(url)
//   .set({'user-key': API_KEY})
// }

app.get('*', (req, res) => res.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// function loadGames() {
//   console.log('hit loadGames');
//   client.query('SELECT COUNT (*) FROM games;')
//     .then(result => {
//       if(!parseInt(result.rows[0].count)) {
//         fs.readFile('../book-list-client/data/books.json', 'utf8', (err, fd) => {
//           JSON.parse(fd).forEach(ele => {
//             client.query(`
//             INSERT INTO games(game_id, title, genres, platforms, esrb, first_release_date, image_url, summary)
//             VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
//             [ele.game_id, ele.title, ele.genres, ele.platforms, ele.esrb, ele.first_release_date, ele.image_url, ele.summary]
//             )
//               .catch(console.error);
//           });
//         });
//       }
//     });
// }
function loadGamesDB() {
  console.log('hit loadDB');
  client.query(`
    CREATE TABLE IF NOT EXISTS
    games(
      table_id SERIAL,
      game_id INTEGER NOT NULL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      genres INTEGER, 
      platforms INTEGER, 
      esrb INTEGER, 
      first_release_date INTEGER, 
      image_url VARCHAR(255), 
      summary TEXT
    );`
  )

    .then(console.log)
    .catch(console.error);
}


function loadUserDB() {
  console.log('hit loadUserDB');
  client.query(`
    CREATE TABLE IF NOT EXISTS
    users(
      user_id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255)
    );`
  )

    .then(console.log)
    .catch(console.error);
}

function userGamesDB() {
  console.log('hit userGamesDB');
  client.query(`
    CREATE TABLE IF NOT EXISTS
    userGames(
      game_id INTEGER NOT NULL REFERENCES games(game_id),
      user_id INTEGER NOT NULL REFERENCES users(user_id)
    );`
  )

    .then(console.log)
    .catch(console.error);
}
loadGamesDB();
loadUserDB();
userGamesDB();