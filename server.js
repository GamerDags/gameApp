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

//Application Middleware
app.use(cors());

//API Endpoints
app.get('/', (req, res) => {

  let query = '';
  //add query values from homepage form
  if(req.query.age) query += `&filter[esrb][eq]=${req.query.age}`;
  if(req.query.genre) query += `&filter[genre][eq]=${req.query.genre}`;
  if(req.query.consoles) query += `&filter[isbn][eq]=${req.query.isbn}`;
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

let query = '&filter[rating][gte]=75&filter[genres][eq]=5';
let url = `https://api-2445582011268.apicast.io/games/?fields=name,genres${query}&limit=25`;
  console.log (url);

  //get request from API
  superagent.get(url)
    .set({'user-key': API_KEY})
    .then(res => console.log(res.body))//need to build from here
    .catch(console.error);
