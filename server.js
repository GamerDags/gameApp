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
  let url = 'https://api-2445582011268.apicast.io/games/meta';

  let query = '';
  //add query values from homepage form

  superagent.get(url).set({'user-key': API_KEY}).set({'Accept': 'application/json'}).asJSON();
})

