// Library files
var handlebars      = require('handlebars');
var template        = require('./template.hbs');

// Localization files
var ptStrings       = require('./pt.json');
var enStrings       = require('./en.json');

var dataServer      = "http://54.213.20.132/data.json";

enStrings["data"] = ["string", "another string"];

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