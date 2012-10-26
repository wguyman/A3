//Width and height
var w = 1000;
var h = 600;
var padding = 30;


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

//Create circles
svg.selectAll("circle")
   .data(dataset)
   .enter()
   .append("circle")
   .attr("cx", function(d) {
   		return xScale(d[1]);
   })
   .attr("cy", function(d) {
   		return yScale(d[2]);
   })
   .attr("r", function(d) {
   		return rScale(d[3]);
   })
   .attr("fill","white")
   .attr("stroke","black");

//Create labels
svg.selectAll("text")
   .data(dataset)
   .enter()
   .append("text")
   .text(function(d) {
   		return d[0];
   })
   .attr("x", function(d) {
   		return xScale(d[1])-5;//-5 to center text. TODO: come up with a better way of doing this.  
   })
   .attr("y", function(d) {
   		return yScale(d[2]);
   })
   .attr("font-family", "sans-serif")
   .attr("font-size", "11px")
   .attr("fill", "blue");

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
