/* UofT SCS Data Analytics Boot Camp
  Unit 15 - D3 Assignment
  Filename: app.js
  Author:   Vivianti Santosa
  Date:     2020-09-12
*/
console.log("Unit 15 - Data Journalism and D3 Assignment")

// Create a container for the chart ------------------------------------------------
var svgWidth = 800;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// X AXIS -------------------------------------------------------------------------
// Initial Parameters
var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) { 
  var xPadding = d3.max(censusData, d => d[chosenXAxis]) - d3.min(censusData, d => d[chosenXAxis]); // calculate axis padding 
  var xLinearScale = d3.scaleLinear()  // create scales
    .domain([ d3.min(censusData, d => d[chosenXAxis]) - 0.2 * xPadding ,
              d3.max(censusData, d => d[chosenXAxis]) + 0.2 * xPadding ])
    .range([0, width]);
  return xLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxesX(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}

// Y AXIS -----------------------------------------------------------------------
// Initial Parameters for y-axis
var chosenYAxis = "healthcare";

// function used for updating y-scale var upon click on axis label
function yScale(censusData, chosenYAxis) { 
  var yPadding = d3.max(censusData, d => d[chosenYAxis]) - d3.min(censusData, d => d[chosenYAxis]); // calculate axis padding 
  var yLinearScale = d3.scaleLinear()  // create scales
    .domain([ d3.min(censusData, d => d[chosenYAxis]) - 0.1 * yPadding ,
              d3.max(censusData, d => d[chosenYAxis]) + 0.1 * yPadding ])
    .range([height, 0]);
  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxesY(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
}

//----------------------------------------------------------------------------------
// function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
  return circlesGroup;
}
//function to add text --------------------------------------------------------------
function renderCirclesText(circlesText, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  circlesText.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis])+5);

  return circlesText;
}
// function used for updating circles group with new tooltip !!,!! -----
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  if (chosenXAxis === "poverty") {
    var xLabel = "Poverty:";}
  else if (chosenXAxis === "age") {
    var xLabel = "Median Age :";}
  else {
    var xLabel = "Household Income: $";}

  if (chosenYAxis === "healthcare") {
    var yLabel = "Healthcare:";}
  else if (chosenYAxis === "obesity") {
    var yLabel = "Obesity:";}
  else {
    var yLabel = "Smokers:";} 

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${yLabel} ${d[chosenYAxis]}<br>${xLabel} ${d[chosenXAxis]}`);

    });
  console.log(chosenXAxis)
  
  circlesGroup.call(toolTip);

  //mouseover event
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
  // onmouseout event
  .on("mouseout", function(data) {
    toolTip.hide(data);
  });

  return circlesGroup;
}
// ---------------------------------------------------------------------------------
// Retrieve data from the CSV file and execute everything below --------------------
d3.csv("assets/data/data.csv").then(function(censusData, err) {
  if (err) throw err;

  console.log("data")
  console.log(censusData)

  // parse data
  censusData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.healthcare = +data.healthcare;
    data.income = +data.income;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
  });

  // activate xLinearScale function above csv import
  var xLinearScale = xScale(censusData, chosenXAxis);
  var yLinearScale = yScale(censusData, chosenYAxis);

  // Create initial axis functions (default function to create axises)
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis= chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")  // name of the group / chart type
    .data(censusData)
    .enter()
    .append("circle") // adding HML aspect (code) named circle
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .classed("stateCircle", true)

    // append initial circle labels
  var circlesTextGroup= chartGroup.append("g")

  var circlesText = circlesTextGroup.selectAll("text")
    .data(censusData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis])+5)
    .text(d => d.abbr)
    .classed("stateText", true);

  // Create group for 3 x-axis labels ---------------------------------------------
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty (%)");

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Median Age (year)");

  var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Median Household Income ($)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);   

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {
        chosenXAxis = value;    // replaces chosenXAxis with value
        
        xLinearScale = xScale(censusData, chosenXAxis); // updates x scale for new data 

        // updates x axis with transition
        xAxis = renderAxesX(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        //update circle text with new x values
        circlesText = renderCirclesText(circlesText, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change xTitle (the chosen one) to bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
          .classed("active", false)
          .classed("inactive", true);
          incomeLabel
          .classed("active", false)
          .classed("inactive", true);
        }
        else if (chosenXAxis === "age"){
          povertyLabel
          .classed("active", false)
          .classed("inactive", true);
          ageLabel
          .classed("active", true)
          .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          povertyLabel
          .classed("active", false)
          .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

  // Create group for y-axis labels  -----------------------------------------------
  var YlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width + 20}, ${height / 2})`);

  var healthcareLabel = YlabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", -725)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("active", true)
    .text("Healthcare (%)");

  var obesityLabel = YlabelsGroup.append("text")
    .attr("transform", "rotate(-90)")  
    .attr("x", 0)
    .attr("y", -745)
    .attr("value", "obesity") // value to grab for event listener
    .classed("inactive", true)
    .text("Obesity (%)");

  var smokesLabel = YlabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", -765)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smoker (%)");

  // y axis labels event listener
  YlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenYAxis with value
        chosenYAxis = value;

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(censusData, chosenYAxis);
      
        // updates y axis with transition
        yAxis = renderAxesY(yLinearScale, yAxis);

        // updates circles with new y values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        //update circle text with new y values
        circlesText = renderCirclesText(circlesText, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text for x axis
        if (chosenYAxis === "obesity") {
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "smokes") {
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "healthcare") {
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });      
}).catch(function(error) {
  console.log(error);
});
