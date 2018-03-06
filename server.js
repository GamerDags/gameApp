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

const API_KEY = 'f437e031dccacc81a5f64f8e94a6e02b';

//database setup
const client = igdb('f437e031dccacc81a5f64f8e94a6e02b');
client.connect();
client.on('error', err => console.error(err));

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
  if(req.query.score && req.query.score < 50) query += `&filter[rating][gt]=${req.query.score}`;
  if(req.query.score && req.query.score > 50) query += `&filter[rating][lt]=${req.query.score}`;
  if(req.query.yearRange) query += `&[release_date.date][in]=${req.query.yearRange}`;

  let url = `https://api-2445582011268.apicast.io/games/?fields=*${query}&limit=25&offset=0`;

  console.log (url);

  superagent.get(url).set({'user-key': API_KEY}).then(response => console.log(response.body));
})

