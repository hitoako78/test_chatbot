//yurzavertu@desoz.com
//hitoako78@gmail.com
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const restService = express();
const ngrok = require('ngrok');

var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/chatbotdb";
var restUrl = "";
/*
MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) { 
        if (err) throw err; 
        console.log("Connected to Database!");
        // print database name
        console.log("db object points to the database : "+ client.db.databaseName); 
        // delete the database
        client.db("chatbotdb").dropDatabase(function(err, result){ 
        console.log("Error : "+err); 
        if (err) throw err; 
        console.log("Operation Success ? "+result); 
        // after all the operations with db, close it.
        client.close(); 
    });
})
*/

restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.use(bodyParser.json());

restService.post('/gen_details', function(req, res) {
    console.log("restService post");
    console.log(req.body);
    var languages = ["english", "hiligayon"];
    var langBlockRedirect = {
                               "proceed": ["proceed","magproceed ako"],
                               "exit": ["exit","indi ko magproceed"] 
                            };
    var proceedLangIdx = 0;
    var langPrefix = "Eng";
       
    var jsonResponse = {};

    if (req.body.lang !== 'undefined') {
       if(req.body.lang.toString().toLowerCase() == "english") {
           proceedLangIdx = 0;
           langPrefix = "Eng";
       }
       if(req.body.lang.toString().toLowerCase() == "hiligayon") {
           proceedLangIdx = 1;
           langPrefix = "Hil";
       }
    }
        
    if (req.body.is_proceed !== 'undefined') {
       console.log(req.body.is_proceed);
       if (req.body.is_proceed.toString().toLowerCase() == langBlockRedirect.exit[proceedLangIdx])
           jsonResponse = {
             "redirect_to_blocks": [langPrefix + " Registration Halt"]
           }
       if (req.body.is_proceed.toString().toLowerCase() == langBlockRedirect.proceed[proceedLangIdx])
           jsonResponse = {
             "redirect_to_blocks": [langPrefix + " Registration Part 2"]
           }
    }
    console.log(jsonResponse);
    res.send(jsonResponse);


});


/*(async function() {
  const url = await ngrok.connect(8000);
  console.log(url);
  restUrl = url;
})();*/
restService.listen((process.env.PORT || 8000), () => console.log('Express server is listening on port 8000'));