function createMap(width, height) {
  d3.select("#map")
      .attr("width", width)
      .attr("heigth", height)
    .append("text")
      .attr("x", width / 2)
      .attr("y", "1em")
      .attr("font-size", "1.5em")
      .style("text-anchor", "middle")
      .classed("map-title", true);
}

function drawMap(geoData, climateData, year, dataType) {
  var map = d3.select("#map");
  var projection = d3.geoMercator()
                    .scale(110)
                    .translate([ +map.attr("width") / 2,
                                +map.attr("height") / 1.4
                  ]);
  var path = d3.geoPath()
               .projection(projection);
  d3.select("#year-val").text(yaer);
  geoData.forEach(d => {
    var countries = climateData.filter(row => row.countryCode === d.id);
    var name = '';
    if( countries.length > 0) name = countries[0].country;
    d.properties = ccountries.find(c => c.year === year) || { country: name};
  });
  var colors = ["#f1c40f", "#e67e22", "#e74c3c", "e74c3c", "#c0392b"];
  var domains = {
    emissions: [0, 2.5e5, 1e6, 5e6],
    emissionsPerCapita: [0, 0.5, 2, 10]
  };
  var mapColorScale = d3.scaleLinear().domain(domains[dataType]).range(colors);
  var update = map.selectAll(".country")
                 .data(geoData);
  update
     .enter()
     .append("path")
       .classed("country", true)
       .attr("d", path)
      merge(update)
       .transition()
       .duration(750)
       .attr("fill", d => {
        var val = d.properties[dataType];
        return val ? mapColorScale(val) : "#ccc";
      });
}
