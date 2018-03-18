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
};

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

const available_restaurants = [
    "all", "mara", "foobar", "foodoo"
];

const botToken = "bot538823896:AAFk-HybRj3n9D2yu5FZVp_Ukr1BZt0xTPc";
const telegramUrl = "https://api.telegram.org/";
const sendMessage = "/sendMessage";


app.get('/', function(req, res) {
  res.send('Hello world\n');
});

app.get('/heitomi', function(req,res) {
 // const message = req.query.msg;
  console.log('GET request got in /heitomi from IP addr:' + req.ip);
  res.status(200).send('ok');
});

app.post('/getFood', function(req, res) {

  const body = req.body;
  console.log('POST request to /getFood, body:' + JSON.stringify(body));

  //ID of the person making the request
  const chatId = req.body.message.chat.id;
  const message = req.body.message.text;

  axios.post(telegramUrl + botToken + sendMessage)
      .then(() => {

  })

  res.status(200).send();
});

//app.listen(PORT, HOST);
httpsServer.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`);
