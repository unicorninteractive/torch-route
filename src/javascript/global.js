// Library files
var rivets          = require('rivets');

// Localization files
var ptStrings       = require('./pt.json');
var enStrings       = require('./en.json');

var appLang         = "en";
var appLocale       = "local";
var appData         = {};
var data;
var dataServer      = "http://54.213.20.132/data.json";

appData.strings = enStrings;
appData.date = getMonth();
appData.langEn = true;
appData.searchLocal = true;
appData.searchGlobal = false;

rivets.bind(document.getElementById('app'), appData);

document.getElementById('en').addEventListener('click', function(e) {
    appData.langEn = true;
    appData.langPt = false;
    appLang = "en";
    appData.strings = enStrings;
    appData.questions = parseQuestions(data[0][appLang + "_" + appLocale]);
});

document.getElementById('pt').addEventListener('click', function(e) {
    appData.langPt = true;
    appData.langEn = false;
    appLang = "pt";
    appData.strings = ptStrings;
    appData.questions = parseQuestions(data[0][appLang + "_" + appLocale]);
});

document.getElementById('local').addEventListener('click', function(e) {
    appData.searchLocal = true;
    appData.searchGlobal = false;
    appLocale = "local";
    appData.questions = parseQuestions(data[0][appLang + "_" + appLocale]);
});

document.getElementById('global').addEventListener('click', function(e) {
    appData.searchLocal = false;
    appData.searchGlobal = true;
    appLocale = "global";
    appData.questions = parseQuestions(data[0][appLang + "_" + appLocale]);
});

var request = new XMLHttpRequest();
request.open('GET', dataServer, true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    data = JSON.parse(request.responseText);
    appData.questions = parseQuestions(data[0][appLang + "_" + appLocale]);
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

rivets.formatters.google = function(value) {
    return "https://www.google.com/search?q=" + value;
};

document.getElementById('twitter-share').addEventListener('click', function(e) {
  if (appLang === "en") {
    shareText = enStrings.twitter_share_text;
  } else {
    shareText = ptStrings.twitter_share_text;
  }
  var url = "http://googletrends.github.io/olympic-torch/";
  var w = 550;
  var h = 300;
  var top = (screen.height / 2) - (h / 2);
  var left = (screen.width / 2) - (w / 2);
  var href = "http://twitter.com/share?text=" + shareText + "&url=" + encodeURI(url);
  window.open(href, "twitter", "height=" + h + ",width=" + w + ",top=" + top + ",left=" + left + ",resizable=1");
});