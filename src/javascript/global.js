// Library files
var rivets          = require('rivets');

// Localization files
var ptStrings       = require('./pt.json');
var enStrings       = require('./en.json');

var appData         = {};
var dataServer      = "http://54.213.20.132/data.json";

appData.strings = enStrings;
appData.date = getMonth();

rivets.bind(document.getElementById('app'), appData);

document.getElementById('en').addEventListener('click', function(e) {
    e.target.className += 'selected';
    appData.strings = enStrings;
});

document.getElementById('pt').addEventListener('click', function(e) {
    e.target.className += 'selected';
    appData.strings = ptStrings;
});

var request = new XMLHttpRequest();
request.open('GET', dataServer, true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    var data = JSON.parse(request.responseText);
    appData.questions = parseQuestions(data[0]["en_global"]);
  }
};

request.send();

function parseQuestions(string) {
    var stringArray = string.split(/\r?\n/);
    return stringArray;
}

function getMonth() {
    var d = new Date();
    var month = [];
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    return month[d.getMonth()] + " " + d.getDay();
}