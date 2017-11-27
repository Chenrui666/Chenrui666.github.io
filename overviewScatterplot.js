var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleLinear()
    .rangeRound([0, width]);


var y = d3.scaleLinear()
    .rangeRound([height, 0]);




var svg = d3.select("#chart1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position","absolute");

var choice = d3.select("body").append("choice");


d3.queue()
  .defer(d3.csv, "BKnutrition-clean.csv")
  .defer(d3.csv, "Mnutrition-clean.csv")
  .awaitAll(function(error, data) {

  if (error) throw error;
  var BKdata = data[0];
  var Mdata = data[1];
  console.log(BKdata)
  console.log(Mdata);

  BKdata.forEach(function(d) {
    d.Store = "Burger King";
    d.Sodium = +d.Sodium;
    d.Calories = +d.Calories;
  });

  Mdata.forEach(function(d) {
    d.Store = "McDonalds";
    d.Sodium = +d.Sodium;
    d.Calories = +d.Calories;
  });

  var combinedData = BKdata.concat(Mdata);

  x.domain(d3.extent(combinedData, function(d) { return d.Sodium; })).nice();
  y.domain(d3.extent(combinedData, function(d) { return d.Calories; })).nice();

  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
    .append("text")
      .attr("x", width)
      .attr("y", -6)
      .attr("text-anchor", "end")
      .attr("fill", "black")
      .text("Sodium (mg)");

  svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "strat")
      .attr("fill", "black")
      .text("Calories");

  svg.selectAll(".dot")
      .data(combinedData)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", function(d) {
        if (d.TotalFat == 0) return "1.5";

        else return (d.TotalFat/2);
      })
      .attr("cx", function(d) { return x(d.Sodium); })
      .attr("cy", function(d) { return y(d.Calories); })
      .attr("fill", function(d) {
        if (d.Store === "Burger King") {
          return "orange";
        }
        else {
          return "red";
        }
      })
      .on("mouseover", function(d) {
            div.transition()
                .duration(50)
                .style("opacity", 0.8)
                .style("left", x(d.Sodium) + "px")
                .style("top", y(d.Calories) + "px")
            div .html(d.Item + "</br>"
                      + "Calories: " + d.Calories + "</br>"
                      + "Sodium: " + d.Sodium + " mg" + "</br>"
                      + "Fat: " + d.TotalFat + " g")

            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(100)
                .style("opacity", 0);
        })
        .on("click", function(d) {
           if (d.TotalFat <= 300 & d.Sodium<= 400) return "Good choice!";
           else return "Maybe think about this choice again?"


        });
