var d3			= require('d3');

var svg = d3.select('.timeline')
            .append('svg')
            .attr('width','100%')
            .attr('height', '90px');

var currentDate;
var svgElement = svg[0][0];
var width = svgElement.clientWidth;

var timeFormat = d3.time.format('%B %e');

var xScale = d3.time.scale()
        .domain([new Date("2016-5-3"), new Date("2016-8-5")])
        .range([30, width - 60]);

function redrawTimeline() {
    width = svgElement.clientWidth;
    endLabel.attr('x', width - 15);
    xScale.range([30, width - 60]);
    daySlider.attr('width', xScale(currentDate));
    backgroundRect.attr('width', width - 60);
    rightArrow.attr('transform', 'translate(' + (width - 20) + ', 30)');
    scrubber.attr('transform', 'translate(' + (Math.floor(xScale(currentDate)) - 8) + ', 0)');
}

var backgroundRect = svg.append('rect')
                        .attr('class', 'timeline-bg')
                        .attr('x', 30)
                        .attr('y', 30)
                        .attr('width', width - 60)
                        .attr('height', 30);

var daySlider = svg.append('rect')
                    .attr('class', 'timeline-fg')
                    .attr('x', 30)
                    .attr('y', 30)
                    .attr('width', 0)
                    .attr('height', 30);

var startLabel = svg.append('text')
                    .text('May 3')
                    .attr('id', 'start-label')
                    .attr('y', '80px');

var endLabel = svg.append('text')
                    .text('August 5')
                    .attr('id', 'end-label')
                    .attr('y', '80px')
                    .attr('text-anchor', 'end')
                    .attr('x', (width - 15) + "px");

var leftArrow = svg.append('path')
                    .attr('d', 'M20 0 L20 30 L0 15 Z')
                    .attr('transform', 'translate(0, 30)')
                    .attr('class', 'left-arrow');

var rightArrow = svg.append('path')
                    .attr('d', 'M0 0 L20 15 L0 30 Z')
                    .attr('transform', 'translate(' + (width - 20) + ', 30)')
                    .attr('class', 'right-arrow');

var scrubber = svg.append('g');

var dateLabel = scrubber.append("path")
    .attr('d','M29,23 L37,37 L47,23 L78,23 L78,0 L0,0 L0,23 L29,23 Z')
    .attr('class', 'scrubber');

scrubber.append('text')
        .attr('class', 'day-label')
        .attr('text-anchor', 'middle')
        .attr('x', 34)
        .attr('y', 16);

function updateTimeline(day) {
    currentDate = day;
    d3.select('.day-label').text(timeFormat(day));
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

module.exports = updateTimeline;