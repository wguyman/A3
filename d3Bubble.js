var nodes;
var transitionDuration;

d3.csv("dataset.csv", function(dataset) {
//Tooltip
tooltip = CustomTooltip("vis_tooltip", 200);

//Width and height of chart
var w = 1000;
var h = 600;
var padding = 50;

//Create scale functions
var xScale = d3.scale.linear()
.domain([0, d3.max(dataset, function(d) { return d.population; })])
.range([padding, w - padding * 2]);

var yScale = d3.scale.linear()
.domain([0, d3.max(dataset, function(d) { return d.age; })])
.range([h - padding, padding]);

var rScale = d3.scale.linear()
.domain([0, d3.max(dataset, function(d) { return d.birth_death_ratio; })])
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
svg = d3.select("#vis")
			.append("svg")
			.attr("width", w)
			.attr("height", h);


//Initial Transition Duration and Gender Switch Duration
var transitionDuration = 1000;


//Just a quick transition of the fading between hovering on nodes
var fadeOutTransition = 150;

//Set up initial g elements with circle and text in it
var gnodes = svg.selectAll(".node").data(dataset)
         .enter().append("g")
         .each(generateCirclesAndText)
         .attr("class", "node")
         .attr("transform",function(d) {return "translate("+xScale(d.population) +",600)"})
         .transition()//This transition is pretty useless just experimenting. It fades and rises the circles a little on load. 
         .duration(transitionDuration)
          .style('opacity', .75)
          .attr("transform",function(d) {return "translate("+xScale(d.population) +"," + yScale(d.age)+")"})

//Use this selector to manipulate the bubbles
nodes = svg.selectAll(".node").data(dataset);

//draws circle and text within gnode
function generateCirclesAndText(d){
  //gnode is this
  d3.select(this).append("circle")
      .attr("r", function(d) {
        return rScale(d.birth_death_ratio);
      })
      .attr("cx", function(d) {
        return 0;
      })
      .attr("cy", function(d) {
        return 0;//0 to rise up from the axis
      })
      .attr("fill",function(d) {
        if(d.gender == 0)
          return "steelblue";
        else
          return "pink";
      })
      .attr("stroke","black");
  d3.select(this).append("text")
      .attr("text-anchor","middle")
      .text(function(d) { return d.year; });
}


//On mouseover change the fill and show the tooltip
nodes.on('mouseover', function(d, i) {
  nodes.filter(function(p) {
   return d != p;
  })
  .transition()
  .duration(fadeOutTransition)
   .style('opacity', '.1');
  nodes.filter(function(p) {
   return d == p;
  })
  .each(function(selection){
    console.log(selection.year)//gives the node at the first array position
    var content = "<span class=\"name\">Population in "+selection.year+":</span><span class=\"value\"> " + selection.population + "</span><br/>";
    content += "<span class=\"name\">You'll live to age</span><span class=\"value\"> " + selection.age + "</span><br/>";
    content += "<span class=\"name\">Ratio of births/deaths in "+selection.year+":</span><span class=\"value\"> " + selection.birth_death_ratio + "</span><br/>";
    return tooltip.showTooltip(content, d3.event)//need event capture, typically content, event, selection 
  });
})
// Clear the fill
nodes.on('mouseout', function(d, i) {
 nodes.filter(function(p) {
   return d !== p;
  })
  .transition()
  .duration(fadeOutTransition)
   .style('opacity', '.75');
  tooltip.hideTooltip();
})


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
});

//When the user clicks to filter by gender

function toggle_view(gender){
  nodes
    .transition()
    .duration(transitionDuration)
     .style('opacity', '.75');
  var type;
  if(gender=="male")
    type = 0;
  if(gender=="female")
    type = 1;
  if(gender!="both"){
    nodes.filter(function(p) {
       return type != p.gender;
      })
      .transition()
      .duration(transitionDuration)
       .style('opacity', '.1');
    }
}



