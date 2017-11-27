

var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleLinear()
    .rangeRound([0, width]);


var y = d3.scaleLinear()
    .rangeRound([height, 0]);




var svg = d3.select("chart1-BK").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

var choice = d3.select("body").append("choice");



d3.csv("BKnutrition-clean.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.Sodium = +d.Sodium;
    d.Calories = +d.Calories;
  });



  x.domain(d3.extent(data, function(d) { return d.Sodium; })).nice();
  y.domain(d3.extent(data, function(d) { return d.Calories; })).nice();

  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
    .append("text")
      .attr("x", width)
      .attr("y", -6)
      .attr("text-anchor", "end")
      .text("Sodium (mg)");

  svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "strat")
      .text("Calories");

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", function(d) {
        if (d.TotalFat == 0) return "1.5";

        else return (d.TotalFat/2);
      })
      .attr("cx", function(d) { return x(d.Sodium); })
      .attr("cy", function(d) { return y(d.Calories); })
      .attr("fill", "orange")
      .on("mouseover", function(d) {
            div.transition()
                .duration(50)
                .style("opacity", 0.9);
            div .html(d.Item + "</br>"
                      + "Calories: " + d.Calories + "</br>"
                      + "Sodium: " + d.Sodium + " mg" + "</br>"
                      + "Fat: " + d.TotalFat + " g")
                .style("left", (d3.Sodium) + "px")
                .style("top", (d3.Calories - 28) + "px");
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




  var legend = svg.selectAll(".legend")
      //.data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

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
