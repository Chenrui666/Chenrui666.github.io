var svg = d3.select("#chart2"),
    margin = {top: 40, right: 80, bottom: 40, left: 80},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.28);

var x1 = d3.scaleBand()
    .padding(0.1);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#FCCC92", "#FC5B5B"]);

var colorLegend = d3.scaleOrdinal()
        .range(["orange", "red"]);


d3.csv("cate-cal.csv", function(d, i, columns) {
  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
  return d;
}, function(error, data) {
  if (error) throw error;

  var keys = data.columns.slice(1);

  var div = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0)
          .style("position","absolute");

  x0.domain(data.map(function(d) { return d.Category; }));
  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();
  console.log(data);
  g.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + x0(d.Category) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return x1(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x1.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) {
        if (d.key == "BK") return "#FCCC92";
        else return "#FC5B5B";
      })
      .on("mouseover",function(d,i){
        d3.select(this)
          .attr("fill" , function(d) {
            if (d.key == "M") return "red";
            else return "orange";
          });

        d3.select("div")
          .transition()
          .duration(50)
          .style("opacity", 0.8)
          .style("left", x1(d.key))
          .style("top", y(d.value));

          div.html(d.value)


      })
      .on("mouseout",function(d,i){
        d3.select(this)
          .transition()
              .duration(300)
          .attr("fill",function(d) {
            if (d.key == "BK") return "#FCCC92";
            else return "#FC5B5B";
          })


      });

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x0));

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Calories");






  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
});
