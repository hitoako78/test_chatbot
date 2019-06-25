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

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("customers").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
}); 
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
})*/