'use strict';

var fs = require('fs');
var http = require('http');
var https = require('https');

var privateKey  = fs.readFileSync('ssl/key.pem', 'utf8');
var certificate = fs.readFileSync('ssl/cert.pem', 'utf8');

//console.log("privatekey:" + privateKey);
//console.log("cert:" + certificate);

const credentials = {
  key: privateKey,
  cert: certificate
}

const express = require('express');
const bodyParser = require('body-parser');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
const httpsServer = https.createServer(credentials, app);
// use the body parser
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello world\n');
});

app.get('/heitomi', (req,res) => {
 // const message = req.query.msg;
  console.log('GET request got in /heitomi from IP addr:' + req.ip);
  res.status(200).send('ok');
});

app.post('/getFood', (req, res) => {

  const body = req.body;
  console.log('POST request to /getFood, body:' + JSON.stringify(body));
  res.status(200).send();
});

//app.listen(PORT, HOST);
httpsServer.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`);
