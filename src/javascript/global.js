// Project files
require('./date');

// Library files
var handlebars      = require('handlebars');
var template        = require('./template.hbs');

// Localization files
var ptStrings       = require('./pt.json');
var enStrings       = require('./en.json');

var dataServer      = "http://54.213.20.132/data.json";

enStrings["data"] = [
    "Question One",
    "Question Two",
    "Question Three",
    "Question Four",
    "Question Five",
    "Question Six",
    "Question Seven",
    "Question Eight",
    "Question Nine",
    "Question Ten"
];

enStrings["date"] = getMonth();

var htmlEnglish      = template(enStrings);
var htmlPortugese    = template(ptStrings);

document.getElementById('app').innerHTML = htmlEnglish;

document.getElementById('en').addEventListener('click', function(e) {
    document.getElementById('app').innerHTMl = htmlEnglish;
});

document.getElementById('pt').addEventListener('click', function(e) {
    document.getElementById('app').innerHTML = htmlPortugese;
});

var request = new XMLHttpRequest();
request.open('GET', dataServer, true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    var data = JSON.parse(request.responseText);
    console.log(data[0]);
  }
};

request.send();


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