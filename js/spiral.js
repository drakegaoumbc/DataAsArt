var width = 500,
      height = 600,
      start = 0,
      end = 2.25,
      numSpirals = 2
      margin = {top:50,bottom:50,left:50,right:50};

    var theta = function(r) {
      return numSpirals * Math.PI * r;
    };


    var r = d3.min([width, height]) / 2 - 40;

    var radius = d3.scaleLinear()
      .domain([start, end])
      .range([40, r]);

    var svg = d3.select("#chart3").append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var points = d3.range(start, end + 0.001, (end - start) / 1000);

    var spiral = d3.radialLine()
      .curve(d3.curveCardinal)
      .angle(theta)
      .radius(radius);

    var path = svg.append("path")
      .datum(points)
      .attr("id", "spiral")
      .attr("d", spiral)
      .style("fill", "none")
      .style("stroke", "black");

    var categories = [1900,1901,1902,1903,1904,1905,1906,1907,1908,1909,1910,1911,1912,1913,1914,1915,1916,1917,1918,1919,1920,1921,1922,1923,1924,1925,1926,1927,1928,1929,1930,1931,1932,1933,1934,1935,1936,1937,1938,1939,1940,1941,1942,1943,1944,1945,1946,1947,1948,1949,1950,1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014];
    var scores = [33.5,35.3,36.4,34.6,32.7,33.1,33.9,34,36,37.3,37.5,38.2,40,40.3,40.8,40.5,43.1,40.8,32.5,44.4,45.2,51.3,53,48.9,47.8,46.7,45.6,48.9,47,47.8,49.2,51.5,54.6,56,53.7,55.2,51.4,52.5,54.3,56,54.9,55.3,58.2,56.1,57.7,59.6,61,61.9,62.5,62.7,62.9,63.4,63.8,64.5,65.9,66.1,66.1,65.5,65.8,66.5,66.3,67.1,66.9,66.6,67.3,67.6,67.6,68.5,67.9,68.6,68.3,68.9,69.1,69.3,70.3,71.3,71.6,72,72.4,72.9,72.5,73.2,73.6,73.5,73.6,73.4,73.4,73.4,73.2,73.3,73.6,73.8,73.9,73.7,73.9,73.9,74.2,74.7,74.8,74.7,75.1,75.3,75.4,75.7,76.1,76.2,76.7,77,77.3,77.7,78,78.2,78.4,78.4,78.5]
    var degrees = ["low","low","low","low","low","low","low","low","low","low","low","low","low","low","low","low","low","low","low","low","low","low","low","low","low","low","low","low","low","low","low","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high"]

    var spiralLength = path.node().getTotalLength(),
        N = categories.length,
        barWidth = (spiralLength / N) - 1;
    var someData = [];
    for (var i = 0; i < N; i++) {      
      someData.push({
        cat: categories[i],
        value: scores[i],
        degree: degrees[i]
      });
    }

    var ordinalScale = d3.scaleBand()
      .domain(categories)
      .range([0, spiralLength]);
    
    // yScale for the bar height
    var yScale = d3.scaleLinear()
      .domain([0, d3.max(someData, function(d){
        return d.value;
      })])
      .range([0, (r / numSpirals) - 30]);

    svg.selectAll("rect")
      .data(someData)
      .enter()
      .append("rect")
      .attr("x", function(d,i){
        
        var linePer = ordinalScale(d.cat),
            posOnLine = path.node().getPointAtLength(linePer),
            angleOnLine = path.node().getPointAtLength(linePer - barWidth);
      
        d.linePer = linePer; // % distance are on the spiral
        d.x = posOnLine.x; // x postion on the spiral
        d.y = posOnLine.y; // y position on the spiral
        
        d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180 / Math.PI) - 90; //angle at the spiral position

        return d.x;
      })
      .attr("y", function(d){
        return d.y;
      })
      .attr("width", function(d){
        return barWidth;
      })
      .attr("height", function(d){
        return yScale(d.value);
      })
      .style("fill", function(d){if(d.degree == "veryhigh"){ return '#0B6AD5' } 
        else if(d.degree == "high") {return "#35D34B"} 
        else if(d.degree == "medium") {return "#FF9102"} 
        else if(d.degree == "low") {return "#FFD916"} 
        else {return '#D5005D'}})
      .style("stroke", "none")
      .attr("transform", function(d){
        return "rotate(" + d.a + "," + d.x  + "," + d.y + ")"; // rotate the bar
      });
    
    // add date labels
    var tF = d3.timeFormat("%b %Y"),
        firstInMonth = {};

    svg.selectAll("text")
      .data(someData)
      .enter()
      .append("text")
      .attr("dy", 16)
      .style("text-anchor", "start")
      .style("font", "16px arial")
      .append("textPath")
      .filter(function(d,i){
        return i % 10 === 1;
      })
      .text(function(d){
        return d.cat;
      })
      // place text along spiral
      .attr("xlink:href", "#spiral")
      .style("fill", "grey")
      .attr("startOffset", function(d){
        return ((d.linePer / spiralLength) * 100) + "%";
      })


    var tooltip = d3.select("#chart3")
    .append('div')
    .attr('class', 'tooltip');

    tooltip.append('div')
    .attr('class', 'date');
    tooltip.append('div')
    .attr('class', 'value');

    svg.selectAll("rect")
    .on('mouseover', function(d) {

        tooltip.select('.date').html("Year: <b>" + d.cat + "</b>");
        tooltip.select('.value').html("Life Expectancy: <b>" + d.value + "<b>");

        d3.select(this)
        .style("fill","#FFFFFF")
        .style("stroke","#000000")
        .style("stroke-width","2px");

        tooltip.style('display', 'block');
        tooltip.style('opacity',2);

    })
    .on('mousemove', function(d) {
        tooltip.style('top', (d3.event.layerY + 10) + 'px')
        .style('left', (d3.event.layerX - 25) + 'px');
    })
    .on('mouseout', function(d) {
        d3.selectAll("rect")
        .style("fill", function(d){if(d.degree == "veryhigh"){ return '#0B6AD5' } 
        else if(d.degree == "high") {return "#35D34B"} 
        else if(d.degree == "medium") {return "#FF9102"} 
        else if(d.degree == "low") {return "#FFD916"} 
        else {return '#D5005D'}})
        .style("stroke", "none")

        tooltip.style('display', 'none');
        tooltip.style('opacity',0);
    });   



//// whtie new
var width = 500,
      height = 600,
      start = 0,
      end = 2.25,
      numSpirals = 2
      margin = {top:50,bottom:50,left:50,right:50};

    var theta = function(r) {
      return numSpirals * Math.PI * r;
    };


    var r = d3.min([width, height]) / 2 - 40;

    var radius = d3.scaleLinear()
      .domain([start, end])
      .range([40, r]);

    var svg = d3.select("#chart4").append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var points = d3.range(start, end + 0.001, (end - start) / 1000);

    var spiral = d3.radialLine()
      .curve(d3.curveCardinal)
      .angle(theta)
      .radius(radius);

    var path = svg.append("path")
      .datum(points)
      .attr("id", "spiral")
      .attr("d", spiral)
      .style("fill", "none")
      .style("stroke", "black");

    var categories = [1900,1901,1902,1903,1904,1905,1906,1907,1908,1909,1910,1911,1912,1913,1914,1915,1916,1917,1918,1919,1920,1921,1922,1923,1924,1925,1926,1927,1928,1929,1930,1931,1932,1933,1934,1935,1936,1937,1938,1939,1940,1941,1942,1943,1944,1945,1946,1947,1948,1949,1950,1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014];
    var scores = [48.7,51,53.8,52.5,49.5,50.6,51.4,50.4,53.3,54.2,52,54.9,56.2,55.7,57.5,57.5,55.2,55.3,43.2,57.4,55.6,62.9,61.9,59.6,63.4,62.4,59.6,63.9,60,60.3,63.5,64.7,64.5,66.3,64.6,65,61.9,63.8,66.8,66.6,66.6,68.5,69.4,65.7,68.4,69.5,70.3,70.5,71,71.9,72.2,72.4,72.6,73,73.7,73.7,73.9,73.7,73.9,74.2,74.1,74.6,74.5,74.4,74.7,74.8,74.8,75.2,75,75.3,75.6,75.8,75.9,76.1,76.7,77.3,77.5,77.9,78,78.4,78.1,78.4,78.7,78.7,78.7,78.7,78.8,78.9,78.9,79.2,79.4,79.6,79.8,79.5,79.6,79.6,79.7,79.9,80,79.9,79.9,80,80.1,80.2,80.5,80.5,80.7,80.9,80.9,81.2,81.3,81.3,81.4,81.4,81.4]
    var degrees = ["low","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","low","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","medium","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high","high", "high"]

    var spiralLength = path.node().getTotalLength(),
        N = categories.length,
        barWidth = (spiralLength / N) - 1;
    var someData = [];
    for (var i = 0; i < N; i++) {      
      someData.push({
        cat: categories[i],
        value: scores[i],
        degree: degrees[i]
      });
    }

    var ordinalScale = d3.scaleBand()
      .domain(categories)
      .range([0, spiralLength]);
    
    // yScale for the bar height
    var yScale = d3.scaleLinear()
      .domain([0, d3.max(someData, function(d){
        return d.value;
      })])
      .range([0, (r / numSpirals) - 30]);

    svg.selectAll("rect")
      .data(someData)
      .enter()
      .append("rect")
      .attr("x", function(d,i){
        
        var linePer = ordinalScale(d.cat),
            posOnLine = path.node().getPointAtLength(linePer),
            angleOnLine = path.node().getPointAtLength(linePer - barWidth);
      
        d.linePer = linePer; // % distance are on the spiral
        d.x = posOnLine.x; // x postion on the spiral
        d.y = posOnLine.y; // y position on the spiral
        
        d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180 / Math.PI) - 90; //angle at the spiral position

        return d.x;
      })
      .attr("y", function(d){
        return d.y;
      })
      .attr("width", function(d){
        return barWidth;
      })
      .attr("height", function(d){
        return yScale(d.value);
      })
      .style("fill", function(d){if(d.degree == "veryhigh"){ return '#0B6AD5' } 
        else if(d.degree == "high") {return "#35D34B"} 
        else if(d.degree == "medium") {return "#FF9102"} 
        else if(d.degree == "low") {return "#FFD916"} 
        else {return '#D5005D'}})
      .style("stroke", "none")
      .attr("transform", function(d){
        return "rotate(" + d.a + "," + d.x  + "," + d.y + ")"; // rotate the bar
      });
    
    // add date labels
    var tF = d3.timeFormat("%b %Y"),
        firstInMonth = {};

    svg.selectAll("text")
      .data(someData)
      .enter()
      .append("text")
      .attr("dy", 16)
      .style("text-anchor", "start")
      .style("font", "16px arial")
      .append("textPath")
      .filter(function(d,i){
        return i % 10 === 1;
      })
      .text(function(d){
        return d.cat;
      })
      // place text along spiral
      .attr("xlink:href", "#spiral")
      .style("fill", "grey")
      .attr("startOffset", function(d){
        return ((d.linePer / spiralLength) * 100) + "%";
      })

var tooltip2 = d3.select("#chart4")
    .append('div')
    .attr('class', 'tooltip');

    tooltip2.append('div')
    .attr('class', 'date');
    tooltip2.append('div')
    .attr('class', 'value');

    svg.selectAll("rect")
    .on('mouseover', function(d) {

        tooltip2.select('.date').html("Year: <b>" + d.cat + "</b>");
        tooltip2.select('.value').html("Life Expectancy: <b>" + d.value + "<b>");

        d3.select(this)
        .style("fill","#FFFFFF")
        .style("stroke","#000000")
        .style("stroke-width","2px");

        tooltip2.style('display', 'block');
        tooltip2.style('opacity',2);

    })
    .on('mousemove', function(d) {
        tooltip2.style('top', (d3.event.layerY + 10) + 'px')
        .style('left', (d3.event.layerX - 25) + 'px');
    })
    .on('mouseout', function(d) {
        d3.selectAll("rect")
        .style("fill", function(d){if(d.degree == "veryhigh"){ return '#0B6AD5' } 
        else if(d.degree == "high") {return "#35D34B"} 
        else if(d.degree == "medium") {return "#FF9102"} 
        else if(d.degree == "low") {return "#FFD916"} 
        else {return '#D5005D'}})
        .style("stroke", "none")

        tooltip2.style('display', 'none');
        tooltip2.style('opacity',0);
    });   