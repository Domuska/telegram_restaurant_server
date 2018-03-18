'use strict';

let fs = require('fs');
let http = require('http');
let https = require('https');
let axios = require('axios');

//get the ssl keys
let privateKey  = fs.readFileSync('ssl/key.pem', 'utf8');
let certificate = fs.readFileSync('ssl/cert.pem', 'utf8');

//get the bot token from files
let botToken = fs.readFileSync('bot_token', 'utf8');
botToken = botToken.trim();



//console.log("privatekey:" + privateKey);
//console.log("cert:" + certificate);
//console.log("bot token:" + botToken);

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
    {
        id: 1,
        name: "all"
    },
    {
        id: 2,
        name: "mara"
    },
    {
        id: 3,
        name: "foobar"
    }
];

const telegramUrl = "https://api.telegram.org/";
const sendMessage = "/sendMessage";
const answerInlineQuery = "/answerInlineQuery";


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

  if(req.body.hasOwnProperty("message")){
      handleMessagePost(req.body.message, res);
  }
  else if (req.body.hasOwnProperty("inline_query")){
      handleInlineQuery(req.body.inline_query, res);
  }
  else if (req.body.hasOwnProperty("chosen_inline_result")){
      handleChosenInlineResult(req.body.chosen_inline_result, res);
  }
  else{
      res.status(200).send();
  }

});

function handleMessagePost(messageBody, res){
    //text body of the message
    const message = messageBody.text;
    console.log("message:" + message);

    //ID of the person making the request
    const chatId = messageBody.chat.id;
    console.log("chat id:" + chatId);

    const postBody = {
        chat_id : chatId,
        text: "Örtsoppa och potatismus. Delicious. Mjölk om du vill."
    };

    const url = telegramUrl + botToken + sendMessage;
    console.log("url message being sent to:" + url);

    axios.post(url, postBody)
        .then(response => {
            console.log("response to sendMessage post:" + response);
            res.status(200).send();
        })
        .catch(error => {
            console.log("error at sendMessage post: " + error);
            res.status(200).send();
        });
}

/**
 * Handle an incoming inline query. Will respond with array of InlineQueryResultDocuments to the
 * necessary url to handle these requests. Each of the documents will represent one restaurant
 * @param inlineQuery
 * @param res
 */
function handleInlineQuery(inlineQuery, res){

    const url = telegramUrl + botToken + answerInlineQuery;


    let documents = [];
    available_restaurants.forEach(function(restaurant){

        //input_message_content is what is printed to chat when user chooses that option
        documents.push({
            type: "article",
            id: restaurant.id,
            title: restaurant.name,
            description: "The menu for restaurant " + restaurant.name,
            input_message_content: {
                message_text: "Today's menu for " + restaurant.name + " is Ärtsoppa och potatismus. Och mjölk."
            }
        });
    });

    //cache time short for testing purposes. Maybe should be put higher later.
    const postBody = {
        inline_query_id : inlineQuery.id,
        results: documents,
        cache_time: 10
    };

    axios.post(url, postBody)
        .then(response => {
            console.log("response to inlineQuery post" + response);
            res.status(200).send();
        })
        .catch(error => {
            console.log("error at send inline query post: " + error);
            res.status(200).send();
        });

}

function handleChosenInlineResult(chosenResult, res){

    switch(chosenResult.query.result_id) {

        default:
            res.status(20)
    }
}

//app.listen(PORT, HOST);
httpsServer.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
