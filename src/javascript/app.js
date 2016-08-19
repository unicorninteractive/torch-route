// Library files
var rivets          = require('rivets');
var dialog          = require('dialog-polyfill');
var d3              = require('d3');

var translations    = require('./translations.json');

var ptStrings       = translations.pt;
var enStrings       = translations.en;
var esStrings       = translations.es;

var appLang         = "en";
var appLocale       = "global";
var appData         = {};
var data;
var dataUrl      = "data.json";

appData.strings = enStrings;
appData.date = formatDate();
appData.langEn = true;
appData.searchLocal = false;
appData.searchGlobal = true;
appData.currentDay = 0;
appData.maxIndex = 0;

rivets.bind(document.getElementById('app'), appData);

document.getElementById('en').addEventListener('click', function(e) {
    appData.langEn = true;
    appData.langEs = false;
    appData.langPt = false;
    appLang = "en";
    appData.date = formatDate(appData.currentDay);
    appData.strings = enStrings;
    appData.questions = parseQuestions(data[0][appLang + "_" + appLocale]);
    document.getElementById('start-label').innerHTML = enStrings.start_date;
    document.getElementById('end-label').innerHTML = enStrings.start_date;
    updateTimeline(appData.currentDay);
});

document.getElementById('pt').addEventListener('click', function(e) {
    appData.langPt = true;
    appData.langEs = false;
    appData.langEn = false;
    appLang = "pt";
    appData.date = formatDate(appData.currentDay);
    appData.strings = ptStrings;
    appData.questions = parseQuestions(data[0][appLang + "_" + appLocale]);
    document.getElementById('start-label').innerHTML = ptStrings.start_date;
    document.getElementById('end-label').innerHTML = ptStrings.end_date;
    updateTimeline(appData.currentDay);
});

document.getElementById('es').addEventListener('click', function(e) {
    appData.langPt = false;
    appData.langEs = true;
    appData.langEn = false;
    appLang = "es";
    appData.date = formatDate(appData.currentDay);
    appData.strings = esStrings;
    appData.questions = parseQuestions(data[0][appLang + "_" + appLocale]);
    document.getElementById('start-label').innerHTML = esStrings.start_date;
    document.getElementById('end-label').innerHTML = esStrings.end_date;
    updateTimeline(appData.currentDay);
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
request.open('GET', dataUrl, true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    data = JSON.parse(request.responseText);

    for (var x in data) {
      if (data[x].en_global && data[x].en_local && data[x].pt_global && data[x].pt_local && data[x].es_global && data[x].es_local) {
        appData.currentDay = new Date(data[x].date + "T16:00");
        appData.date = formatDate(appData.currentDay);
        appData.currentIndex = data[x].id;
        appData.currentMap = "images/maps/map-" + data[x].id + ".svg";
      }
    }

    updateTimeline(appData.currentDay);
    appData.maxIndex = appData.currentIndex;
    appData.questions = parseQuestions(data[appData.currentIndex - 1][appLang + "_" + appLocale]);
  }
};

request.send();

function parseQuestions(string) {
    var stringArray = string.split(/\r?\n/);
    return stringArray;
}

function formatDate(day) {
    var d = new Date(day);
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

    if (appLang == "es") {
      month[4] = esStrings.may;
      month[5] = esStrings.june;
      month[6] = esStrings.july;
      month[7] = esStrings.august;
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
    var isInDialog=(rect.top <= event.clientY && event.clientY <= rect.top + rect.height && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
    if (!isInDialog) {
        dialogs.close();
    }
});

// Timeline code
var svg = d3.select('.timeline')
            .append('svg')
            .attr('width','100%')
            .attr('height', '90px');

var currentDate;
var svgElement = svg[0][0];
var boundingBox = svgElement.getBoundingClientRect();
var width = boundingBox.width;

var timeFormat = d3.time.format('%B %e');

var xScale = d3.time.scale()
        .domain([new Date("2016-05-03T16:00"), new Date("2016-08-05T16:00")])
        .range([30, width - 60]);

function redrawTimeline() {
    width = svgElement.getBoundingClientRect().width;
    endLabel.attr('x', width - 15);
    // xScale.range([30, width - 60]);
    // daySlider.attr('width', xScale(currentDate));
    // backgroundRect.attr('width', width - 60);
    // rightArrow.attr('transform', 'translate(' + (width - 20) + ', 30)');
    scrubber.attr('transform', 'translate(' + xScale(currentDate) + ', 0)');
}

function brushed() {

  var value = brush.extent()[1];

  if (d3.event.sourceEvent) {
    value = xScale.invert(d3.mouse(this)[0]);
  }

  scrubber.attr('transform', 'translate(' + xScale(value) + ', 0)');

  // updateTimeline(brush.extent()[1]);
}

var backgroundRect = svg.append('rect')
                        .attr('class', 'timeline-bg')
                        .attr('x', 30)
                        .attr('y', 30)
                        .attr('width', width - 60)
                        .attr('height', 20);

var brush = d3.svg.brush()
            .x(xScale)
            .extent([new Date("2016-05-03T16:00"), new Date("2016-08-05T16:00")])
            .on("brush", brushed);

var daySlider = svg.append('rect')
                    .attr('class', 'timeline-fg')
                    .attr('x', 30)
                    .attr('y', 30)
                    .attr('width', 0)
                    .attr('height', 20);

var startLabel = svg.append('text')
                    .text('May 3')
                    .attr('id', 'start-label')
                    .attr('y', '70px');

var endLabel = svg.append('text')
                    .text('August 5')
                    .attr('id', 'end-label')
                    .attr('y', '70px')
                    .attr('text-anchor', 'end')
                    .attr('x', (width - 15) + "px");

var leftArrow = svg.append('path')
                    .attr('d', 'M20 0 L20 20 L0 10 Z')
                    .attr('transform', 'translate(0, 30)')
                    .attr('class', 'left-arrow')
                    .on('click', previousDay);

var rightArrow = svg.append('path')
                    .attr('d', 'M0 0 L20 10 L0 20 Z')
                    .attr('transform', 'translate(' + (width - 20) + ', 30)')
                    .attr('class', 'right-arrow')
                    .on('click', nextDay);

function previousDay() {
  if (appData.currentIndex > 1) {
    appData.currentIndex--;
    appData.currentDay = new Date(data[appData.currentIndex - 1].date + "T16:00");
    appData.currentMap = "images/maps/map-" + appData.currentIndex + ".svg";
    appData.questions = parseQuestions(data[appData.currentIndex - 1][appLang + "_" + appLocale]);
    updateTimeline(appData.currentDay);
  }
}

function nextDay() {
  if (appData.currentIndex < appData.maxIndex) {
    appData.currentIndex++;
    appData.currentDay = new Date(data[appData.currentIndex - 1].date + "T16:00");
    appData.currentMap = "images/maps/map-" + appData.currentIndex + ".svg";
    appData.questions = parseQuestions(data[appData.currentIndex - 1][appLang + "_" + appLocale]);
    updateTimeline(appData.currentDay);
  }
}

document.onkeydown = function(e) {
  e = e || window.event;

  switch(e.which || e.keyCode) {
        case 37:
        previousDay();
        break;

        case 39:
        nextDay();
        break;

        default: return;
    }
    e.preventDefault();
};

var scrubber = svg.append('g');
// var scrubber = svg.append('g').call(brush);

var dateLabel = scrubber.append("path")
    .attr('d','M29,23 L37,37 L47,23 L78,23 L78,0 L0,0 L0,23 L29,23 Z')
    .attr('class', 'scrubber');

scrubber.append('text')
        .attr('class', 'day-label')
        .attr('text-anchor', 'middle')
        .attr('x', 39)
        .attr('y', 17);

function updateTimeline(day) {
    currentDate = day;
    d3.select('.day-label').text(formatDate(day));
    daySlider.attr('width', xScale(day));
    scrubber.attr('transform', 'translate(' + (Math.floor(xScale(day)) - 8) + ', 0)');
}

var debounce = function(fn, timeout) {
    var timeoutID = -1;
    return function() {
        if (timeoutID > -1) {
            window.clearTimeout(timeoutID);
        }
    timeoutID = window.setTimeout(fn, timeout);
    };
};

var debounceDraw = debounce(function() {
    redrawTimeline();
}, 100);

d3.select(window).on('resize', debounceDraw);