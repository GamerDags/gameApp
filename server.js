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

const API_KEY = '';

//database setup - is this still needed?
// const client = igdb(API_KEY);
// client.connect();
// client.on('error', err => console.error(err));

//Application Middleware
app.use(cors());

//API Endpoints
app.get('/', (req, res) => {

  let query = '';
  //add query values from homepage form
  if(req.query.age) query += `&filter[esrb][eq]=${req.query.age}`;
  if(req.query.genre) query += `&filter[genre][eq]=${req.query.genre}`;
  if(req.query.console) query += `&isbn[eq]=${req.query.isbn}`;
  if(req.query.ratings) query += `&[total_rating_count][lt]=${req.query.ratings}`;
  if(req.query.score && req.query.score < 50) query += `&filter[rating][gte]=${req.query.score}`;
  if(req.query.score && req.query.score > 50) query += `&filter[rating][lte]=${req.query.score}`;
  if(req.query.yearRange) query += `&[release_date.date][in]=${req.query.yearRange}`;

  //set URL for API query
  let url = `https://api-2445582011268.apicast.io/games/?fields=*${query}&limit=25&offset=0`;
  console.log (url);

  //get request from API
  superagent.get(url)
    .set({'user-key': API_KEY})
    .then(res => console.log(res.body))//need to build from here
    .catch(console.error);
})

