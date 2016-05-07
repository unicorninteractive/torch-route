// Library files
var rivets          = require('rivets');
var dialog          = require('dialog-polyfill');

// Project files
var timeline        = require('./timeline');

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
appData.currentDay = 0;

rivets.bind(document.getElementById('app'), appData);

document.getElementById('en').addEventListener('click', function(e) {
    appData.langEn = true;
    appData.langPt = false;
    appLang = "en";
    appData.date = getMonth();
    appData.strings = enStrings;
    appData.questions = parseQuestions(data[0][appLang + "_" + appLocale]);
    document.getElementById('start-label').innerHTML = enStrings.start_date;
    document.getElementById('end-label').innerHTML = enStrings.start_date;
});

document.getElementById('pt').addEventListener('click', function(e) {
    appData.langPt = true;
    appData.langEn = false;
    appLang = "pt";
    appData.date = getMonth();
    appData.strings = ptStrings;
    appData.questions = parseQuestions(data[0][appLang + "_" + appLocale]);
    document.getElementById('start-label').innerHTML = ptStrings.start_date;
    document.getElementById('end-label').innerHTML = ptStrings.end_date;
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

    for (var x in data) {
      if (data[x].en_global && data[x].en_local && data[x].pt_global && data[x].pt_local) {
        appData.currentDay = new Date(data[x].date);
        appData.currentIndex = data[x].id;
      }
    }

    timeline(appData.currentDay);
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
    month[4] = enStrings.may;
    month[5] = enStrings.june;
    month[6] = enStrings.july;
    month[7] = enStrings.august;

    if (appLang == "pt") {
      month[4] = ptStrings.may;
      month[5] = ptStrings.june;
      month[6] = ptStrings.july;
      month[7] = ptStrings.august;
    }

    return month[d.getMonth()] + " " + d.getDate();
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

document.getElementById('facebook-share').addEventListener('click', function(e) {
  var url = "http://googletrends.github.io/olympic-torch/";
  var w = 600;
  var h = 400;
  var top = (screen.height / 2) - (h / 2);
  var left = (screen.width / 2) - (w / 2);
  var href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURI(url);
  window.open(href, "facebook", "height=" + h + ",width=" + w + ",top=" + top + ",left=" + left + ",resizable=1");
});

var dialogs = document.querySelector('dialog');
dialog.registerDialog(dialogs);

document.getElementById('dialog-show').addEventListener('click', function(e) {
  dialogs.showModal();
});

dialogs.addEventListener('click', function (event) {
    var rect = dialogs.getBoundingClientRect();
    var isInDialog=(rect.top <= event.clientY && event.clientY <= rect.top + rect.height
      && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
    if (!isInDialog) {
        dialogs.close();
    }
});