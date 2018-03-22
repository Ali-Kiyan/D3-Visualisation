//getting data into js



d3.queue()
  .defer(d3.json, "//unpkg.com/world-atlas@1.1.4/world/50m.json")
  .defer(d3.csv, "./data/all_data.csv", function(row) {
    return {
      continent: row.Continent,
      country: row.Contry,
      countryCode: row["Country Code"],
      emissions: +row["Emissions"],
      emmission: +row["Emissions"],
      emissionsPerCapita: +row["Emissions Per Capita"],
      region: row.Region,
      year: +row.Year
    }
  })
  .await(function(error, mapData, data){
    if(error) throw error;
    var extremeYears = d3.extent(data, d=> d.year);
    var currentYear = extremeYears[0];
    var currentDataType = d3.select('input[name="data-type"]:checked')
                          .attr("value");
    var geoData = topojson.feature(mapData, mapData.objects.countires).features;
    var width = +d3.select(".chart-container")
                  .node().offsetWidth;
                  //only require width and height
    createMap(width, width * 4 / 5);
    //require both dataset as well as the current year and the current data type
    drawMap(geoData, data, currentYear, currentDataType);

    d3.select("#year")
      .property("min", currentYear )
      .property("max", extremeYears[1])
      .property("value", currentYear)
      .on("input", () => {
        currentYear = +d3.event.target.value;
        drawMap(geoData, data, currentYear, currentDataType);
      });
      d3.selectAll('input[name="data-type"]')
        .on("change", () => {
          currentDataType = d3.event.target.value;
          drawMap(geoData, data, currentYear, currentDataType);
        });
  });
