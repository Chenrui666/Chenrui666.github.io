var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleLinear()
    .rangeRound([0, width]);


var y = d3.scaleLinear()
    .rangeRound([height, 0]);




var svg = d3.select("#chart1")
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
      .attr("x", width+14)
      .attr("y", -6)
      .attr("text-anchor", "end")
      .attr("fill", "black")
      .attr("font-weight", "bold")
      .text("Sodium (mg)");

  svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("x", 42)
      .attr("y", -3)
      .attr("dy", "0.71em")
      .attr("text-anchor", "strat")
      .attr("font-weight", "bold")
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
                .style("background-color", function(){
                  if (d.Store === "Burger King") {
                    return "orange";
                  }
                  else {
                    return "red";
                  }
                })
            div .html(d.Item + "</br>"
                      + "Calories: " + d.Calories + "</br>"
                      + "Sodium: " + d.Sodium + " mg" + "</br>"
                      + "Fat: " + d.TotalFat + " g")

            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(100)
                .style("opacity", 0);
        });


        var legend = svg.selectAll(".legend")
            .data(Store)
            .enter().append("g")
              .attr("class", "legend")
              .attr("transform", function(d, i) {
                return "translate(0," + i * 20 + ")";
              });

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", "orange");

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });
});
