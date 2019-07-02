//yurzavertu@desoz.com
//hitoako78@gmail.com
//`1Diagchat
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const requestPromise = require('request-promise');
const chatfuelBroadcast = require('chatfuel-broadcast').default;
const url = require('url');
const restService = express();
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const ngrok = require('ngrok');

var restUrl = "https://fbwebhook.alliedworld.healthcare";
var BOT_ID = "5d19dd5c992c360001db815a";
var CHATFUEL_TOKEN = "mELtlMAHYqR0BvgEiMq8zVek3uYUK3OJMbtyrdNPTrQB9ndV0fM7lWTFZbM4MZvD";


restService.engine('html', require('ejs').renderFile); 

restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.use(bodyParser.json());

restService.post('/gen_details', function(req, res) {
    console.log("restService post");
    console.log(req.body);
    var languages = ["english", "hiligayon"];
    var langBlockRedirect = {
        "has_4p_yes": ["yes", "oo"],
        "has_4p_no": ["no", "wala"]
    };
    var proceedLangIdx = 0;
    var langPrefix = "Eng";

    if (req.body.lang !== 'undefined') {
        if (req.body.lang.toString().toLowerCase() == "english") {
            proceedLangIdx = 0;
            langPrefix = "Eng";
        }
        if (req.body.lang.toString().toLowerCase() == "hiligayon") {
            proceedLangIdx = 1;
            langPrefix = "Hil";
        }
    }

    if (typeof req.body.has_4p !== 'undefined') {
        console.log(req.body.is_proceed);
        if (req.body.has_4p.toString().toLowerCase() == langBlockRedirect.has_4p_yes[proceedLangIdx])
            jsonResponse = {
                "redirect_to_blocks": [langPrefix + " Registration Part 3-1"]
            }
        if (req.body.has_4p.toString().toLowerCase() == langBlockRedirect.has_4p_no[proceedLangIdx])
            jsonResponse = {
                "redirect_to_blocks": [langPrefix + " Registration Part 3-2"]
            }
    }
    console.log(jsonResponse);
    res.send(jsonResponse);
});

restService.post('/save_gen_details', function(req, res) {
    console.log("restService post");
    console.log(req.body);
   
    var jsonResponse = {};
    
    var first_name = req.body.first_name;
    var middle_name = req.body.middle_name;
    var last_name = req.body.last_name;
    var gender = req.body.sex;
    var b_date = req.body.b_date;
    var cel_no = req.body.cel_no;
    var email = req.body.email;
    var address = req.body.address;
    var four_p_num = req.body.four_p_num;
    var gov_id_type = req.body.gov_id_type;
    var gov_id = req.body.gov_id;
    var genDetails= {
                            first_name : first_name ,
                            middle_name : middle_name ,
                            last_name : last_name,
                            gender: gender,
                            b_date : b_date,
                            cel_no : cel_no ,
                            email : email ,
                            address : address ,
                            four_p_num : four_p_num ,
                            gov_id_type : gov_id_type ,
                            gov_id : gov_id 
                           };
    var records = [genDetails];
    
    console.log(genDetails);
    const csvWriter = createCsvWriter({
    path: __dirname + '/file.csv',
    header: [
           {id: 'first_name', title: 'first_name'},
           {id: 'middle_name', title: 'middle_name'},
           {id: 'last_name', title: 'last_name'},
           {id: 'gender', title: 'gender'},
           {id: 'cel_no', title: 'cel_no'},
           {id: 'b_date', title: 'b_date'},
           {id: 'email', title: 'email'},
           {id: 'address', title: 'address'},
           {id: 'four_p_num', title: 'four_p_num'},
           {id: 'gov_id_type', title: 'gov_id_type'},
           {id: 'gov_id', title: 'gov_id'}
       ]
    });
    csvWriter.writeRecords(records)       // returns a promise
    .then(() => {
        console.log('...Done');
    });

    var jsonResponse = {
 			"messages": [
   					{"text": "Your general identity data is saved!"}	
 				]
			};
    console.log(jsonResponse);
    res.send(jsonResponse);
});

restService.post('/personal_details', function(req, res) {
    console.log("restService post");
    console.log(req.body);
    var gender = req.body.sex;
    var children_ask = req.body.children_ask;
    var disease = req.body.disease;
    var medication = req.body.medication;
    var events = req.body.events;
    var jsonResponse = {};

    if(typeof disease !== "undefined") {
        if(disease.split(",").some(isNaN)) {
            jsonResponse = {
 				"messages": [
   				{"text": "You have input invalid choices. Please try again"}
 			    ],
                                "redirect_to_blocks": ["Eng Personal Sheet 2-0"]
			};
        } else {
            jsonResponse = {
                                "redirect_to_blocks": ["Eng Personal Sheet 3"]
			};
        }
    }

    if(typeof medication !== "undefined") {
        if(medication.split(",").some(isNaN)) {
            jsonResponse = {
 				"messages": [
   				{"text": "You have input invalid choices. Please try again"}
 			    ],
                                "redirect_to_blocks": ["Eng Personal Sheet 3"]
			};
        } else {
            jsonResponse = {
                                "redirect_to_blocks": ["Eng Personal Sheet 4"]
			};
        }
    }

    if(typeof events !== "undefined") {
        if(events.split(",").some(isNaN)) {
            jsonResponse = {
 				"messages": [
   				{"text": "You have input invalid choices. Please try again"}
 			    ],
                                "redirect_to_blocks": ["Eng Personal Sheet 5-0"]
			};
        } else {
            jsonResponse = {
                                "redirect_to_blocks": ["Eng Personal Sheet 6"]
			};
        }
    }

    if(gender == "Female") { 
	jsonResponse = {
	  "messages": [
	    {
	      "text": "Are you currently pregnant?",
	      "quick_replies": [
	        {
	          "title": "Yes",
	          "set_attributes": {
	            "is_pregnant" : "Yes",
                    "children_ask" : "Yes"
	          }
	        },
	        {
	          "title": "No",
	          "set_attributes": {
	            "is_pregnant": "no",
                    "children_ask" : "Yes"
	          }
	        }
	      ],
	      "quick_reply_options": {
	        "process_text_by_ai": false,
	        "text_attribute_name": "user_message"
	      }
	    }
	  ]
	};
    }
    else if (req.body.children_ask != "null" && typeof req.body.children_ask !== "undefined") { 
	jsonResponse = {
	  "messages": [
	    {
	      "text": "Do you have children under 5 years old?",
	      "quick_replies": [
	        {
	          "title": "Yes",
	          "set_attributes": {
	            "has_toddler": "Yes"
	          }
	        },
	        {
	          "title": "No",
	          "set_attributes": {
	            "has_toddler": "No"
	          }
	        }
	      ],
	      "quick_reply_options": {
	        "process_text_by_ai": false,
	        "text_attribute_name": "user_message"
	      }
	    }
	  ]
	};
    }
    console.log(jsonResponse);
    res.send(jsonResponse);
});
/*****************Terms and Condition Start****************************/
const createTermsButtons = (displayUrl, langTerm) => {
    return {
        messages: [{
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    image_aspect_ratio: 'square',
                    elements: [{
                        title: 'Terms and Condition',
                        subtitle: langTerm,
                        buttons: [{
                            type: 'web_url',
                            url: displayUrl,
                            title: 'Terms and Condition',
                            messenger_extensions: true,
                            webview_height_ratio: 'compact' // Small view
                        }]
                    }]
                }
            }
        }]
    };
};


restService.get('/show-terms-buttons', (request, response) => {
    const userId = request.query.userID;
    const langPrefix = request.query.langPrefix;
    const displayUrl = restUrl + '/license?userID=' + userId + '&langPrefix=' + langPrefix;
    const langTerms = {
        "Eng": "You may follow this link to our full Terms and Conditions",
        "Hil": "Para sa kumpleto nga AWH Terms and Conditions, palihog ckick sini nga link."
    };
    response.json(createTermsButtons(displayUrl, langTerms[langPrefix.substring(0,3)]));
});


restService.post('/license_response', function(req, res) {
    console.log(req.body);
    const botId = BOT_ID;
    const chatfuelToken = CHATFUEL_TOKEN;

    const userId = req.body.userID;
    const langPrefix = req.body.langPrefix;
    const blockName = ((req.body.decision == "Proceed")? (langPrefix + ' Registration Part 2') : (langPrefix + ' Registration Halt'));

    const broadcastApiUrl = `https://api.chatfuel.com/bots/${botId}/users/${userId}/send`;

    const query = Object.assign({
            chatfuel_token: chatfuelToken,
            chatfuel_block_name: blockName
        },
        req.body
    );

    const chatfuelApiUrl = url.format({
        pathname: broadcastApiUrl,
        query
    });

    const options = {
        uri: chatfuelApiUrl,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    requestPromise.post(options)
        .then(() => {
            res.json({});
        });
});

restService.get('/license', function(req, res) {
    var userID = req.query.userID;
    var langPrefix = req.query.langPrefix;
    res.render(__dirname + '/webview/license.html',{userID:userID,langPrefix:langPrefix});
});
/*****************Terms and Condition End****************************/


/*****************Date Time Start****************************/
const createDateButtons = (displayUrl) => {
    return {
        messages: [{
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    image_aspect_ratio: 'square',
                    elements: [{
                        title: 'Birthdate',
                        subtitle: 'Click the following link to choose your Birthdate',
                        buttons: [{
                            type: 'web_url',
                            url: displayUrl,
                            title: 'Birthdate',
                            messenger_extensions: true,
                            webview_height_ratio: 'compact' // Small view
                        }]
                    }]
                }
            }
        }]
    };
};


restService.get('/show-date', (request, response) => {
    const userId = request.query.userID;
    const langPrefix = request.query.langPrefix;
    const displayUrl = restUrl + '/date-picker?userID=' + userId + '&langPrefix=' + langPrefix;
    response.json(createDateButtons (displayUrl));
});


restService.post('/date-picker-response', function(req, res) {
    console.log(req.body);
    const botId = BOT_ID;
    const chatfuelToken = CHATFUEL_TOKEN;

    const userId = req.body.userID;
    const langPrefix = req.body.langPrefix.substring(0,3);
    const blockName = langPrefix + " Registration Part 3-0";

    const broadcastApiUrl = `https://api.chatfuel.com/bots/${botId}/users/${userId}/send`;

    const query = Object.assign({
            chatfuel_token: chatfuelToken,
            chatfuel_block_name: blockName,
            b_date : req.body.date
        },
        req.body
    );

    const chatfuelApiUrl = url.format({
        pathname: broadcastApiUrl,
        query
    });

    const options = {
        uri: chatfuelApiUrl,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    requestPromise.post(options)
        .then(() => {
            res.json({});
        });
});

restService.get('/date-picker', function(req, res) {
    var userID = req.query.userID;
    var langPrefix = req.query.langPrefix;
    res.render(__dirname + '/webview/datepicker.html',{userID:userID,langPrefix:langPrefix});
});
/*****************Date Time End****************************/

/*****************Options Start****************************/
const createOptionsButtons = (displayUrl, OptionTitle, OptionSubtitle) => {
    return {
        messages: [{
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    image_aspect_ratio: 'square',
                    elements: [{
                        title: OptionTitle,
                        subtitle: OptionSubtitle,
                        buttons: [{
                            type: 'web_url',
                            url: displayUrl,
                            title: OptionTitle,
                            messenger_extensions: true,
                            webview_height_ratio: 'compact' // Small view
                        }]
                    }]
                }
            }
        }]
    };
};


restService.get('/show-options', (request, response) => {
    const userId = request.query.userID;
    const langPrefix = request.query.langPrefix;
    const optionType = request.query.optionType;
    const optionSubtitle = {
        "Eng": (optionType == "disease")? "Do you currently take any of these medications?" : 
               (optionType == "medications")? "Do you currently take any of these medications?" :
                                              "Which of the following services or progrgams are you interested in?"
    };
    const displayUrl = restUrl + '/options?userID=' + userId + '&langPrefix=' + langPrefix+ '&optionType=' + optionType;
    response.json(createOptionsButtons (displayUrl, optionType.charAt(0).toUpperCase() + optionType.slice(1), optionSubtitle[langPrefix.substring(0,3)]));
});


restService.post('/option-response', function(req, res) {
    console.log(req.body);
    const botId = "5d148575ab04c40001866aa2";
    const chatfuelToken = "mELtlMAHYqR0BvgEiMq8zVek3uYUK3OJMbtyrdNPTrQB9ndV0fM7lWTFZbM4MZvD";

    const userId = req.body.userID;
    const langPrefix = req.body.langPrefix.substring(0,3);
    const optionType = req.body.optionType;
    const selected_options = req.body.options;
    const blockName = langPrefix + ((optionType == 'disease')?" Personal Sheet 3" : (optionType == 'medications')? " Personal Sheet 4" : " Personal Sheet 6");

    const broadcastApiUrl = `https://api.chatfuel.com/bots/${botId}/users/${userId}/send`;

    var query = {};
    if (optionType == "disease") {
 	query = Object.assign({
            			chatfuel_token: chatfuelToken,
            			chatfuel_block_name: blockName,
            			disease : selected_options
        		    },
        		   req.body
    			 );
    }
    else if (optionType == "medications") {
 	query = Object.assign({
            			chatfuel_token: chatfuelToken,
            			chatfuel_block_name: blockName,
            			medications: selected_options
        		    },
        		   req.body
    			 );
    }
    else if (optionType == "events") {
 	query = Object.assign({
            			chatfuel_token: chatfuelToken,
            			chatfuel_block_name: blockName,
            			events : selected_options
        		    },
        		   req.body
    			 );
    }

    const chatfuelApiUrl = url.format({
        pathname: broadcastApiUrl,
        query
    });

    const options = {
        uri: chatfuelApiUrl,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    requestPromise.post(options)
        .then(() => {
            res.json({});
        });
});

restService.get('/options', function(req, res) {
    var userID = req.query.userID;
    var langPrefix = req.query.langPrefix;
    var optionType = req.query.optionType;
    res.render(__dirname + '/webview/options.html',{userID:userID, langPrefix:langPrefix, optionType:optionType});
});
/*****************Options End****************************/


(async function() {
    const url = await ngrok.connect(8000);
    console.log(url);
    restUrl = url;
})();
restService.listen((process.env.PORT || 8000), () => console.log('Express server is listening on port 8000'));