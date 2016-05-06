var d3			= require('d3');

var svg = d3.select('.timeline')
            .append('svg')
            .attr('width','100%')
            .attr('height', '90px');

var svgElement = svg[0][0];
var width = svgElement.clientWidth;

var timeFormat = d3.time.format('%B %e');

var xScale = d3.time.scale()
        .domain([new Date("2016-5-3"), new Date("2016-8-5")])
        .range([0, width]);

var backgroundRect = svg.append('rect')
                        .attr('class', 'timeline-bg')
                        .attr('x', 0)
                        .attr('y', 30)
                        .attr('width', '100%')
                        .attr('height', 30);

var daySlider = svg.append('rect')
                    .attr('class', 'timeline-fg')
                    .attr('x', 0)
                    .attr('y', 30)
                    .attr('width', xScale(new Date()))
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
                    .attr('x', width - 15);

var scrubber = svg.append('g');

var dateLabel = scrubber.append("path")
    .attr('d','M29,23 L37,37 L47,23 L78,23 L78,0 L0,0 L0,23 L29,23 Z');

scrubber.append('text')
        .attr('class', 'day-label')
        .attr('text-anchor', 'middle')
        .attr('x', 34)
        .attr('y', 16);

function updateTimeline(day) {
    d3.select('.day-label').text(timeFormat(day));

    scrubber.attr('transform', 'translate(' + (Math.floor(xScale(day)) - 14) + ', 0)');
}

module.exports = updateTimeline;