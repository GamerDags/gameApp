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
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;
const TOKEN = process.env.TOKEN;

const API_KEY = 'd5f8b5029dfc0e40ac54647a962a9e42';

//database setup - is this still needed?
// const client = igdb(API_KEY);
// client.connect();
// client.on('error', err => console.error(err));

//Application Middleware
app.use(cors());

//API Endpoints
app.get('/', (req, res) => {

  let query = '&filter[esrb][eq]=2,3';
  //add query values from homepage form
  if(req.query.age) query += `&filter[esrb][eq]=${req.query.age}`;
  if(req.query.genre) query += `&filter[genre][eq]=${req.query.genre}`;
  if(req.query.console) query += `&filter[isbn][eq]=${req.query.isbn}`;
  if(req.query.ratings) query += `&filter[total_rating_count][lt]=${req.query.ratings}`;
  if(req.query.score && req.query.score < 50) query += `&filter[rating][gte]=${req.query.score}`;
  if(req.query.score && req.query.score > 50) query += `&filter[rating][lte]=${req.query.score}`;
  if(req.query.yearRange) query += `&filter[release_date.date][in]=${req.query.yearRange}`;

  //set URL for API query
  let url = `https://api-2445582011268.apicast.io/games/?fields=*${query}&limit=25&offset=0`;
  console.log (url);

  //get request from API
  superagent.get(url)
    .set({'user-key': API_KEY})
    .then(res => console.log(res.body))//need to build from here
    .catch(console.error);
})

// let query = '&filter[rating][gte]=75&filter[genres][eq]=5';
// let url = `https://api-2445582011268.apicast.io/games/?fields=name,genres,platforms,esrb.rating,first_release_date${query}&limit=25`;
//   console.log (url); This one works don't touch.

let query = '&filter[first_release_date][lt]=1104537600000&filter[rating][gte]=75&filter[genres][eq]=5';
let url = `https://api-2445582011268.apicast.io/games/?fields=name,genres,platforms,esrb.rating,first_release_date${query}&limit=25`;
  console.log (url);

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
  superagent.get(url)
    .set({'user-key': API_KEY})
    .then(res => console.log(res.body))//need to build from here
    .catch(console.error);
