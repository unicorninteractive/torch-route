var d3			= require('d3');

var svg = d3.select('.timeline')
            .append('svg')
            .attr('width','100%')
            .attr('height', '90px');

var svgElement = svg[0][0];
var width = svgElement.clientWidth;

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
                    .attr('y', '80px');

var endLabel = svg.append('text')
                    .text('August 5')
                    .attr('y', '80px')
                    .attr('text-anchor', 'end')
                    .attr('x', width - 15);

var dateLabel = svg.append("path")
    .attr("d","M207.360705,23.2895215 L215.729245,37.2624245 L225.021802,23.2895215 L256.37424,23.2895215 L256.37424,-0.222750583 L178,-0.222750583 L178,23.2895215 L207.360705,23.2895215 Z");