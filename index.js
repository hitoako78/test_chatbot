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

var language =  ["English", "Cambodian"];
restService.use(bodyParser.json());

restService.post('/webhook', function(req, res) {
    console.log("restService post");
    console.log(req.body);
    var langIdx = 0;
    
    var patient_name = ((req.body.first_name !== 'undefined')? req.body.first_name : "" )+
                       ((req.body.middle_name !== 'undefined')? req.body.middle_name : "") + 
                       ((req.body.last_name !== 'undefined')? req.body.last_name : "");
                       (req.body.next_name!== 'undefined')? req.body.last_name : "";
    var gender = (req.body.gender !== 'undefined')? req.body.gender : "";
    var birth_date = (req.body.birth_date !== 'undefined')? req.body.birth_date : "";
    var phone_number = (req.body.phone_number !== 'undefined')? req.body.phone_number : "";
    var email = (req.body.email !== 'undefined')? req.body.email : "";
    var id_fb = (req.body.id_fb !== 'undefined')? req.body.id_fb : "";
    var address = ((req.body.lot !== 'undefined')? req.body.lot : "") +
                  ((req.body.nation !== 'undefined')? req.body.nation : "") +
                  ((req.body.city_holder !== 'undefined')? req.body.city_holder : "") +
                  ((req.body.commune !== 'undefined')? req.body.commune : "") +
                  (req.body.village !== 'undefined')? req.body.village : "";
    var gov_id_type = (req.body.gov_id_type !== 'undefined')? req.body.gov_id_type : "";
    var gov_id = (req.body.gov_id !== 'undefined')? req.body.gov_id : "";
    var has_poorcard = (req.body.has_poorcard !== 'undefined')? req.body.has_poorcard : "";
    var poorcard_id = (req.body.poorcard_id !== 'undefined')? req.body.poorcard_id : "";

    if (req.body.lang !== 'undefined')
       if (req.body.lang == "Eng")
       	langIdx = 0;
       if (req.body.lang == "Khm")
       	langIdx = 1;

    var jsonResponse = {};

    function sendResponse(jsonResponse, res) {
	res.send(jsonResponse);
    }
    if(req.body.save_changes !== 'undefined' && req.body.save_changes == "Yes") {
        var isSaved = false;
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
            if (err) throw err;
            console.log("Database created!");
            var dbo = db.db("chatbotdb");
            var myobj = { _patient_name : patient_name, 
                    _gender : gender, 
                    _birth_date : birth_date, 
                    _phone_number : phone_number, 
                    _email : email, 
                    _id_fb : id_fb, 
                    _gov_id_type : gov_id_type, 
                    _gov_id : gov_id, 
                    _has_poorcard : has_poorcard, 
                    _poorcard_id : poorcard_id};
               dbo.collection("identity").insertOne(myobj, function(err, response) {
                 if (err) throw err;
		 else  isSaved = true;
                 console.log("1 document inserted");
                 db.close();
                
                 jsonResponse = {
      		 "messages": [{"text" : isSaved? "Info successfully saved" : "Info successfully failed"}]
                }
   	     console.log(jsonResponse);
    	     sendResponse(jsonResponse,res);
        });
           });
     } else { 
             jsonResponse = {
      		"redirect_to_blocks": [language[langIdx]]
             }
   	     console.log(jsonResponse);
    	     sendResponse(jsonResponse,res);
     }
});


/*(async function() {
  const url = await ngrok.connect(8000);
  console.log(url);
})();*/
restService.listen((process.env.PORT || 8000), () => console.log('Express server is listening on port 8000'));