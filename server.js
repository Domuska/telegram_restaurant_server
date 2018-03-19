'use strict';

//import logger from "./logger";
let logger = require('./logger').getLogger();

let fs = require('fs');
let http = require('http');
let https = require('https');
let axios = require('axios');

const express = require('express');
const bodyParser = require('body-parser');

//get the ssl keys
let privateKey  = fs.readFileSync('ssl/key.pem', 'utf8');
let certificate = fs.readFileSync('ssl/cert.pem', 'utf8');

//get the bot token from files
let botToken = fs.readFileSync('bot_token', 'utf8');
botToken = botToken.trim();

const credentials = {
  key: privateKey,
  cert: certificate
};


//http://juvenes.fi/DesktopModules/Talents.LunchMenu/LunchMenuServices.asmx/GetMenuByWeekday?KitchenId=48&MenuTypeId=93&Week=12&Weekday=1&lang=%27fi%27&format=json
//data tulee juvenekselta seuraavan kaltasena, joka pitää parseta:
let data = {"d":"{\"AdditionalName\":\"2017\\/8\",\"KitchenName\":\"Ravintola Foodoo\",\"MealOptions\":[{\"AlsoAvailable\":\"\",\"ExternalGroupId\":1,\"ExtraItems\":\"\",\"ForceMajeure\":\"\",\"MealOptionId\":31,\"MenuDate\":\"19.3.2018\",\"MenuItems\":[{\"Diets\":\"G,L,PÄ,PAPR\",\"DisplayStyle\":0,\"HideInPrint\":false,\"Ingredients\":\"Ainesosat: Broilerin ohut fileepihvi (Suomalainen broilerinliha), Parmesantyyppinen lastu (Raaka- ja pastöroitu maito, suola, hapate, juoksute, säilöntäaine E1105.) \u003cstrong\u003e(maito)\u003c\\/strong\u003e, Juustoraaste (juusto* [pastöroitu maito*, hapate, suola, happamuudensäätöaine (E 509)] ja paakkuuntumisenestoaine (E 460).) \u003cstrong\u003e(maito)\u003c\\/strong\u003e, Oliiviöljy (Oliiviöljy), Valkosipulimurska (Valkosipuli (70 %), vesi, sokeri, valkoviinietikka, happamuudensäätöaine (sitruunahappo), säilöntäaine (natriumbentsoaatti)), Sitruunatäysmehu, Suola (Suola), Mustapippuri (Mustapippuri rouhittu).\",\"MenuItemID\":\"1958243\",\"Name\":\"Sitruunaista parmesankananfileétä\",\"Name_EN\":\"Chicken fillet in parmesan with lemon\",\"Name_FI\":\"Sitruunaista parmesankananfileétä\",\"Name_SV\":\"Sitruunaista parmesankananfileétä\",\"NutritiveValues\":[{\"DailyAmount\":0,\"Name\":\"Energia\",\"Units\":[{\"Unit\":\"kcal\",\"Value\":235.13},{\"Unit\":\"kJ\",\"Value\":983.79}]},{\"DailyAmount\":0,\"Name\":\"Sokerit\",\"Units\":[{\"Unit\":\"g\",\"Value\":0.13}]},{\"DailyAmount\":0,\"Name\":\"Laktoosi\",\"Units\":[{\"Unit\":\"g\",\"Value\":0}]},{\"DailyAmount\":0,\"Name\":\"Rasva\",\"Units\":[{\"Unit\":\"g\",\"Value\":17.77}]},{\"DailyAmount\":0,\"Name\":\"Tyydyttynyt rasva\",\"Units\":[{\"Unit\":\"g\",\"Value\":0.74}]},{\"DailyAmount\":0,\"Name\":\"Proteiini\",\"Units\":[{\"Unit\":\"g\",\"Value\":19.26}]},{\"DailyAmount\":0,\"Name\":\"Hiilihydraatti\",\"Units\":[{\"Unit\":\"g\",\"Value\":0.34}]},{\"DailyAmount\":0,\"Name\":\"Kuitu\",\"Units\":[{\"Unit\":\"g\",\"Value\":0.08}]},{\"DailyAmount\":0,\"Name\":\"Suola\",\"Units\":[{\"Unit\":\"g\",\"Value\":0.99}]},{\"DailyAmount\":0,\"Name\":\"CO2\",\"Units\":[{\"Unit\":\"kg\",\"Value\":0.01}]}],\"OrderNumber\":1,\"Price\":0},{\"Diets\":\"G,M,L,KA,VE,K,VS,HOT,PÄ,SOIJA\",\"DisplayStyle\":0,\"HideInPrint\":false,\"Ingredients\":\"Ainesosat: Vesi (Vesi), Tomaattimurska (Tomaatti, tomaattimehu), Kookosmaito (kookospähkinäuute, vesi,E471,E466), Soijajuoma (Vesi, SOIJApavut (7%), sokeri, emulgointiaine (E471), happamuudensäätöaine (monokaliumfosfaatti), kalsium, stabilointiaine (gellaanikumi), suola, B2-vitamiini, aromi, foolihappo, D2-vitamiini ja B12-vitamiini.) \u003cstrong\u003e(soijapapu)\u003c\\/strong\u003e, Korianteritahna (Korianteri 74%, vesi, auringonkukkaöljy, suola, sokeri, happamuudensäätöaineet (etikkahappo, sitruunahappo).), Ruokokidesokeri (Sokeri), Valkosipulimurska (Valkosipuli (70 %), vesi, sokeri, valkoviinietikka, happamuudensäätöaine (sitruunahappo), säilöntäaine (natriumbentsoaatti)), Kasvisliemi (Suola, maltodekstriini, tärkkelys, sokeri, hiivauute, kasvikset 8,6 % (sipuli, porkkana, purjosipuli), aromi, porkkanamehujauhe, mausteet. Valmiin liemen suolapitoisuus on 0,7 %.), Rypsiöljy (Rypsiöljy), Massaman currytahna (Sitruunaruoho, kuivattu punainen chili, salottisipuli, suola, korianterinsiemen, juustokumina, valkosipuli, galangal, kaffirlimetti, happamuudensäätöaine E330.), Suola (Suola), Chilirouhe (Chilipippuri.).\",\"MenuItemID\":\"1958244\",\"Name\":\"Tomaatti-currykastike\",\"Name_EN\":\"Sauce with curry and tomato\",\"Name_FI\":\"Tomaatti-currykastike\",\"Name_SV\":\"Tomaatti-currykastike\",\"NutritiveValues\":[{\"DailyAmount\":0,\"Name\":\"Energia\",\"Units\":[{\"Unit\":\"kcal\",\"Value\":56.17},{\"Unit\":\"kJ\",\"Value\":235.03}]},{\"DailyAmount\":0,\"Name\":\"Sokerit\",\"Units\":[{\"Unit\":\"g\",\"Value\":4.02}]},{\"DailyAmount\":0,\"Name\":\"Laktoosi\",\"Units\":[{\"Unit\":\"g\",\"Value\":0}]},{\"DailyAmount\":0,\"Name\":\"Rasva\",\"Units\":[{\"Unit\":\"g\",\"Value\":3.51}]},{\"DailyAmount\":0,\"Name\":\"Tyydyttynyt rasva\",\"Units\":[{\"Unit\":\"g\",\"Value\":2.63}]},{\"DailyAmount\":0,\"Name\":\"Proteiini\",\"Units\":[{\"Unit\":\"g\",\"Value\":0.88}]},{\"DailyAmount\":0,\"Name\":\"Hiilihydraatti\",\"Units\":[{\"Unit\":\"g\",\"Value\":4.95}]},{\"DailyAmount\":0,\"Name\":\"Kuitu\",\"Units\":[{\"Unit\":\"g\",\"Value\":0.77}]},{\"DailyAmount\":0,\"Name\":\"Suola\",\"Units\":[{\"Unit\":\"g\",\"Value\":0.53}]},{\"DailyAmount\":0,\"Name\":\"CO2\",\"Units\":[{\"Unit\":\"kg\",\"Value\":0.28}]}],\"OrderNumber\":2,\"Price\":0},{\"Diets\":\"KELA,G,M,L,KA,VE,VS,PAPR\",\"DisplayStyle\":0,\"HideInPrint\":false,\"Ingredients\":\"Ainesosat: Riisi (Pitkäjyväinen riisi), Vesi (Vesi), Rypsiöljy (Rypsiöljy), Välimeren Yrttiseos (Punainen paprika (25%), yrtit (25%)(basilika, oregano, kynteli, timjami), korianteri, valkosipuli, sipuli, maustepippuri.), Suola (Suola).\",\"MenuItemID\":\"1970108\",\"Name\":\"Yrttiriisi\",\"Name_EN\":\"Rice with herbs\",\"Name_FI\":\"Yrttiriisi\",\"Name_SV\":\"Örtris\",\"NutritiveValues\":[{\"DailyAmount\":0,\"Name\":\"Energia\",\"Units\":[{\"Unit\":\"kcal\",\"Value\":344.62},{\"Unit\":\"kJ\",\"Value\":1441.93}]},{\"DailyAmount\":0,\"Name\":\"Sokerit\",\"Units\":[{\"Unit\":\"g\",\"Value\":0}]},{\"DailyAmount\":0,\"Name\":\"Laktoosi\",\"Units\":[{\"Unit\":\"g\",\"Value\":0}]},{\"DailyAmount\":0,\"Name\":\"Rasva\",\"Units\":[{\"Unit\":\"g\",\"Value\":0.71}]},{\"DailyAmount\":0,\"Name\":\"Tyydyttynyt rasva\",\"Units\":[{\"Unit\":\"g\",\"Value\":0.15}]},{\"DailyAmount\":0,\"Name\":\"Proteiini\",\"Units\":[{\"Unit\":\"g\",\"Value\":7.66}]},{\"DailyAmount\":0,\"Name\":\"Hiilihydraatti\",\"Units\":[{\"Unit\":\"g\",\"Value\":74.44}]},{\"DailyAmount\":0,\"Name\":\"Kuitu\",\"Units\":[{\"Unit\":\"g\",\"Value\":1.6}]},{\"DailyAmount\":0,\"Name\":\"Suola\",\"Units\":[{\"Unit\":\"g\",\"Value\":0.09}]},{\"DailyAmount\":0,\"Name\":\"CO2\",\"Units\":[{\"Unit\":\"kg\",\"Value\":0}]}],\"OrderNumber\":4,\"Price\":0},{\"Diets\":\"\",\"DisplayStyle\":0,\"HideInPrint\":false,\"Ingredients\":\"\",\"MenuItemID\":\"1970109\",\"Name\":\"Kasvislisäke\",\"Name_EN\":\"Vegetables\",\"Name_FI\":\"Kasvislisäke\",\"Name_SV\":\"Kasvislisäke\",\"NutritiveValues\":[{\"DailyAmount\":0,\"Name\":\"Energia\",\"Units\":[{\"Unit\":\"kcal\",\"Value\":0},{\"Unit\":\"kJ\",\"Value\":0}]},{\"DailyAmount\":0,\"Name\":\"Sokerit\",\"Units\":[{\"Unit\":\"g\",\"Value\":0}]},{\"DailyAmount\":0,\"Name\":\"Laktoosi\",\"Units\":[{\"Unit\":\"g\",\"Value\":0}]},{\"DailyAmount\":0,\"Name\":\"Rasva\",\"Units\":[{\"Unit\":\"g\",\"Value\":0}]},{\"DailyAmount\":0,\"Name\":\"Tyydyttynyt rasva\",\"Units\":[{\"Unit\":\"g\",\"Value\":0}]},{\"DailyAmount\":0,\"Name\":\"Proteiini\",\"Units\":[{\"Unit\":\"g\",\"Value\":0}]},{\"DailyAmount\":0,\"Name\":\"Hiilihydraatti\",\"Units\":[{\"Unit\":\"g\",\"Value\":0}]},{\"DailyAmount\":0,\"Name\":\"Kuitu\",\"Units\":[{\"Unit\":\"g\",\"Value\":0}]},{\"DailyAmount\":0,\"Name\":\"Suola\",\"Units\":[{\"Unit\":\"g\",\"Value\":0}]},{\"DailyAmount\":0,\"Name\":\"CO2\",\"Units\":[{\"Unit\":\"kg\",\"Value\":0}]}],\"OrderNumber\":5,\"Price\":0}],\"Name\":\"LOUNAS1\",\"Name_EN\":\"LOUNAS1\",\"Name_FI\":\"LOUNAS1\",\"Name_SV\":\"LOUNAS1\",\"Price\":0}],\"MenuId\":5687,\"MenuTypeId\":93,\"MenuTypeName\":\"Herkkulounas\",\"Name\":\"Oulu ravintola Foodoo Herkkulounas (8-13)\",\"Week\":12,\"Weekday\":1}"};
data = JSON.parse(data.d);



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
  //res.send('Hello world\n');
    //logger.info("hello world of loggers");
    logger.info("data:", data);
    logger.info(data.AdditionalName);
    res.status(200).send("heipä hei");
});

app.get("/hei", function(req, res){

    res.status(200).send("no hei");
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
            res.status(200).send();
    }
}

//needs to be https at production. For developing on localhost app.listen is allright
app.listen(PORT, HOST);
//httpsServer.listen(PORT, HOST);
logger.info(`Running on http://${HOST}:${PORT}`);
