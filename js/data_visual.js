$(function() {

   // sliding effect/click event on tab
   /*$(".slide").on('click', function(e) {
     var $this = $(this);
     var active = $this.parents('ul#nav-ul').find('li.active');
     active.removeClass('active');
     //$this.addClass('active');

     var linkHref = $this.find('a').attr('href');
     $('html, body').animate({
       scrollTop: $(linkHref).offset().top
     });
     e.preventDefault();
   });*/

  const color = d3.scaleOrdinal()
            .range(["#EF7087","#A724E8","#8CBAD1","#DDA335","#D981D5","#82CE8C","#839BE6","#C6D445"]);

  function position() {
      this.style("left", (d) => d.x0 + "px")
      this.style("top", (d) => d.y0 + "px")
      this.style("width", (d) => Math.max(0, d.x1 - d.x0 - 1) + "px")
      this.style("height", (d) => Math.max(0, d.y1 - d.y0  - 1) + "px");
  }

  //const margin = {top: 40, right: 10, bottom: 10, left: 10};
    /*const width = window.innerWidth - margin.left - margin.right;
    const height = 720 - margin.top - margin.bottom;*/
    var margin = {top: 40, right: 10, bottom: 10, left: 10};

        //width = window.innerWidth - margin.left - margin.right,
        //height = 500 - margin.top - margin.bottom;
    var width = 1040,
    height = 600;

  var D3_TreeMap = function(dataSet) {
    'use strict';
    
        //color = d3.scaleOrdinal().range(d3.schemeCategory20c);

    const treemap = d3.treemap().size([width, height]);
    var div = d3.select("div#map").append("div").attr("class", "mapInner");
    div = d3.select(".mapInner").append("div").attr('class', 'col-md-12')
            .attr("position", "relative").append("div")
              .attr("class", "treemap")
              .style("width", width + "px")
              .style("height", height + "px");

    var tool = d3.select("body").append("div").attr("class", "toolTip");

    d3.select(self.frameElement).style("height", height + 300 + "px");
    d3.select(self.frameElement).style("width", width + 20 + "px");

/////////////////////////////////////////////////////////////////
    d3.json(dataSet, function(error, data) {
      //const root = d3.hierarchy(data, (d) => d.children.sum(d) => d.value);
      const root = d3.hierarchy(data, (d) => d.children)
      .sum((d) => (d.value));
      const treeMap = treemap(root);
      var node = div.datum(root).selectAll(".node")
          .data(treeMap.leaves())
          .enter().append("div")
          .attr("class", "node")
          .style("left", (d) => d.x0 + "px")
          .style("top", (d) => d.y0 + "px")
          .style("width", (d) => Math.max(0, d.x1 - d.x0 - 1) + "px")
          .style("height", (d) => Math.max(0, d.y1 - d.y0  - 1) + "px")
          .style("background", (d) => {
            //console.log(d.parent.data);
            return d.parent.data.color;
          })
          .text(function (d) { return d.data.name; })
          .on("mousemove", function (d) {
              tool.style("left", d3.event.pageX + 10 + "px")
              tool.style("top", d3.event.pageY - 20 + "px")
              tool.style("display", "inline-block");
              tool.html(d.children ? null : d.data.name + "<br> Death: " + d.data.value + "<br>on " + d.parent.data.name);
          }).on("mouseout", function (d) {
              tool.style("display", "none");
          });


          // d3.selectAll(".btn").on('click', function() {
          //   console.log(this.value);
          //   onClick(this.value, div, root);
          // });
      });

      // switch data on treemap
      d3.selectAll(".btn").on('change', function() {
        // this.value is the value attr in the radio button
        d3.json(this.value, function(error, data2) {
          var year = $("input:checked").parent().text();
          
          const root = d3.hierarchy(data2, (d) => d.children).sum((d) => (d.value));
          const treeMap = treemap(root);
          var node = div.datum(root).selectAll(".node").data(treeMap.leaves());
              node.enter().append("div").attr("class", "node");
              node.transition().duration(1500)
                  .style("left", (d) => d.x0 + "px")
                  .style("top", (d) => d.y0 + "px")
                  .style("width", (d) => Math.max(0, d.x1 - d.x0 - 1) + "px")
                  .style("height", (d) => Math.max(0, d.y1 - d.y0  - 1) + "px")
                  .style("background", (d) => {
                    return d.parent.data.color;
                  })
                  .text(function (d) { return d.data.name; });
          });

          var year = $("input:checked").parent().text();
          console.log("Year: " + year);
          // legendGen
          var ledgColors = ["#EF7087","#A724E8","#8CBAD1","#DDA335","#D981D5","#82CE8C","#839BE6","#C6D445"];
          var ledgLabels;
          if(year == "1980") {
            ledgLabels = ["Diseases of heart", "Malignant neoplasms", "Cerebrovascular diseases", "Unintentional injuries", "Pneumonia and influenza", "Diabetes mellitus", "Chronic obstructive pulmonary diseases", "Homicide"];
          } else if(year == "2009") {
            ledgLabels = ["Diseases of heart", "Malignant neoplasms", "Cerebrovascular diseases", "Unintentional injuries", "Pneumonia and influenza", "Diabetes mellitus", "Nephritis and hrotic syndrome and nephrosis", "Septicemia"];
          }
          // remove original legends and replace the new one
          $("#chart").replaceWith("<div id='chart'></div>");
          legendGen(year);

          // change barchart
          $("#barchart").replaceWith("<div id='barchart'></div>");
          barChartUpdate(year);
      });
  }

  // legend
  var legendGen = function(year) {
    /// legendd
    var ledgColors = ["#EF7087","#A724E8","#8CBAD1","#DDA335","#D981D5","#82CE8C","#839BE6","#C6D445"];
    var ledgLabels;
      if(year == "1980") {
        ledgLabels = ["Diseases of heart", "Malignant neoplasms", "Cerebrovascular diseases", "Unintentional injuries", "Pneumonia and influenza", "Diabetes mellitus", "Chronic obstructive pulmonary diseases", "Homicide"];
      } else if(year == "2009") {
        ledgLabels = ["Diseases of heart", "Malignant neoplasms", "Cerebrovascular diseases", "Unintentional injuries", "Pneumonia and influenza", "Diabetes mellitus", "Nephritis and hrotic syndrome and nephrosis", "Septicemia"];
      }
      var ledg = d3.select("#chart").append("div").attr("margin-top", 2)
                .style("position", "relative")
                .style("width", width + "px")
                .style("height", 500 + "px");

      for (var i = 0; i < 12; i++) {
          ledg.append('div')
              .attr("class","ledg")
              .style("width", "350px")
              .style("height", "30px")
              .style("left", "5px")
              .style("top", function (d) { return (50 + 42*i) + "px" })
              .text(function (d) { return ledgLabels[i] })
              .style("background", function (d) { return ledgColors[i] })
              .style("color", "black");
      }
  }

  var barChartUpdate = function() {
    var year = $('input:checked').parent().text();
    var dataSet2 = (year == "1980") ? "/DataAsArt/assets/csvfiles/data.csv" : "/DataAsArt/assets/csvfiles/data2.csv";

      var margin = {top: 50, right: 20, bottom: 30, left: 40},
          width = 700 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

      // set ranges
      var x = d3.scaleBand()
                .range([0, width])
                .padding(0.1);
      var y = d3.scaleLinear().rangeRound([height, 0]);

      var svg = d3.select("div#barchart").append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom + 200)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var tool = d3.select("body").append("div").attr("class", "toolTip");

      d3.csv(dataSet2, function(error, data) {
        if(error) throw error;

        data.forEach(function(d) {
          d.value = +d.value;
        });

        x.domain(data.map(function(d) {return d.group;}));
        y.domain([0, d3.max(data, function(d) { return (d.value+0.1); })]);

        // append retangles
        var barGraph = svg.selectAll(".bar").data(data).enter().append("rect").attr("class", "bar")
                          .style("fill", (d) => {
                            return color(d.color);
                          });
                          
           barGraph.transition().duration(500)
           .attr("x", function(d) {return x(d.group);})
           .attr("width", x.bandwidth())
           .attr("y", function(d) {return y(d.value);})
           .attr("height", function(d) {return height - y(d.value);});

        var txt = d3.select(".bar--x");
        svg.append("g")
           .attr("class", "bar--x")
           .attr("transform", "translate(0," + height + ")")
           .call(d3.axisBottom(x).ticks(10))
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)")
          .style("display", "block");

        svg.append("g")
           .call(d3.axisLeft(y).ticks(10, "%"))
           .append("text")
           .attr("y", 35)
           .attr("text-anchor", "end")
           .text("Percentage");
      });

      /*
      d3.selectAll(".btn").on('change', function() {
        
      });*/



  }

  /////////// bar chart
  var barChart = function() {
     barChartUpdate();
      
  }

/*
  console.log()
  var dataAge = [77.79, 77.83, 77.85, 77.97, 78.07, 78.43, 78.63, 79.01, 79.16, 79.25, 79.36, 79.85, 80];*/

  var dataset = $('input[name=year]:checked').val();
  console.log(dataset);
  D3_TreeMap(dataset);
  legendGen(1980)
  barChartUpdate(1980);
  //barChart();
});