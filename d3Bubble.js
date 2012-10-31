//Width and height
var w = 1000;
var h = 600;
var padding = 50;


//Static dataset in the format [Year, population, age, ratio of deaths to births]
var dataset = [
               [1990, 500, 40, 5], [1991, 600, 45, 6], [1992, 700, 50, 6], [1993, 800, 50, 6], [1994, 850, 95, 6],
               [1995, 900, 70, 7], [1996, 1000, 65, 7], [1997, 1100, 67, 5], [1998, 1200, 75, 8], [1999, 1300, 88, 6],
               [2000, 1300, 85, 8]
               ];


//Create scale functions
var xScale = d3.scale.linear()
.domain([0, d3.max(dataset, function(d) { return d[1]; })])
.range([padding, w - padding * 2]);

var yScale = d3.scale.linear()
.domain([0, d3.max(dataset, function(d) { return d[2]; })])
.range([h - padding, padding]);

var rScale = d3.scale.linear()
.domain([0, d3.max(dataset, function(d) { return d[3]; })])
.range([20, 30]);//Change this if you want the range of the radius to differ

//Define X axis
var xAxis = d3.svg.axis()
.scale(xScale)
.orient("bottom")
.ticks(5);

//Define Y axis
var yAxis = d3.svg.axis()
.scale(yScale)
.orient("right")
.ticks(10);

//Create SVG element
var svg = d3.select("body")
.append("svg")
.attr("width", w)
.attr("height", h);


var node = svg.selectAll(".node")
.data(dataset)
.enter().append("g")
.attr("class", "node");



node.append("circle")
.attr("cx", function(d) {
      return xScale(d[1]);
      })
.attr("cy", function(d) {
      return yScale(0);//0 to rise up from the axis
      })
.attr("r", function(d) {
      return rScale(d[3]);
      })
.attr("fill","yellow")
.attr("stroke","black");

node.append("text")
.attr("dx", function(d) {
      return xScale(d[1])-15;//Correction to center the year in the bubble
      })
.attr("dy", function(d) {
      return yScale(0)+5;//Correction to shift year to center in
      })
.text(function(d) { return d[0]; });

// //Delay for transition
transitionDuration = 1000;

//get circles
var circles = svg.selectAll("g circle")

//get labels
var circleLabels = svg.selectAll("g text")

//On mouse hover, change the fill to highlight the current circle (others fade away)
circles
.on('mouseover', function(d, i) {
    circles.filter(function(p) {
                   return d !== p;
                   })
    .style('opacity', '.1');
    circleLabels.filter(function(p) {
                        return d !== p;
                        })
    .style('opacity', '.1');
    })
// Clear the fill
.on('mouseout', function(d, i) {
    circles.filter(function(p) {
                   return d !== p;
                   })
    .style('opacity', '.75');
    circleLabels.filter(function(p) {
                        return d !== p;
                        })
    .style('opacity', '.75');
    })
.transition()//This transition is pretty useless just experimenting. It fades and rises the circles a little on load.
.duration(transitionDuration)
.style('opacity', .75)
.attr('cx', function(d) { return xScale(d[1]) })
.attr('cy', function(d) { return yScale(d[2]) });

//On mouse hover, change the fill to highlight the current circle (others fade away)
circleLabels
.on('mouseover', function(d, i) {
    circles.filter(function(p) {
                   return d !== p;
                   })
    .style('opacity', '.1');
    circleLabels.filter(function(p) {
                        return d !== p;
                        })
    .style('opacity', '.1');
    })
// Clear the fill
.on('mouseout', function(d, i) {
    circles.filter(function(p) {
                   return d !== p;
                   })
    .style('opacity', '.75');
    circleLabels.filter(function(p) {
                        return d !== p;
                        })
    .style('opacity', '.75');
    })
.transition()//This transition is pretty useless just experimenting. It fades and rises the circles a little on load.
.duration(transitionDuration)
.style('opacity', '.75')
.attr('dx', function(d) { return xScale(d[1])-15 })
.attr('dy', function(d) { return yScale(d[2]) });


//Create X axis
svg.append("g")
.attr("class", "axis")
.attr("transform", "translate(25," + (h - padding) + ")")
.call(xAxis);

//Create Y axis
svg.append("g")
.attr("class", "axis")
.attr("transform", "translate(" + (w - padding) + ",0)")
.call(yAxis);

//Add x-axis labels
svg.append("text")
.attr("class", "x label")
.attr("text-anchor", "end")
.attr("x", w/2 +50)
.attr("y", h - 6)//offset to center
.text("Population (millions)");

//Add y-axis labels
svg.append("text")
.attr("class", "y label")
.attr("text-anchor", "end")
.attr("y", w-20)//Careful! these are reversed because of the transform, y is really x
.attr("x",(-h/2 + 70))//offset to center
.attr("dy", ".75em")
.attr("transform", "rotate(-90)")
.text("Life Expectancy (years)");