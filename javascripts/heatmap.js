var Heatmap = {
  defaults: {
    maxValue: 100
    , jsonFile: 'all_users'
  }
  , init: function (opts) {
    jQuery.extend(true, this, this.defaults, opts);
    // Our projection.
    var xy = d3.geo.mercator(),
        path = d3.geo.path().projection(xy);

    var width = $(window).width(),
        height = $(window).height();
    xy.scale(width-width/10);


    var view = d3.select("body")
      .append("svg");
		var svg = view.append("g")    
      .attr("id", "countries")
     	.attr("transform", "translate(" + width/4 + ", " + height/3 + ")")
      .attr("width", width - 20)
      .attr("height", height - 800);

    var fill = d3.scale.log()
        .domain([1, this.maxValue])
        .range(["#ffffbf", "#d7191c"]);

    d3.json("../geo/json/world-countries.json", function(collection) {
      svg.selectAll("path")
          .data(collection.features)
        .enter().append("path")
          .attr("d", path);
    });
    var idx = 0, dates = [];
    var grouped = {};
    //To grouped object
    d3.json("../geo/json/" + this.jsonFile + ".json", function(json) {
      json.forEach(function(d) {
        if(!grouped[d.date]) grouped[d.date] = {};
        grouped[d.date][d.country_corrected] = d.percentage;
      });  

      for (var key in grouped) {
        dates.push(key);
      }
		
			//slider creation
			$('#sliderDIV').append(dates[0]);
			var slider = $('<input value="0" type="range" id="slider">' + dates[dates.length -1] + '</input>');
			var intro = true;
			slider.attr('min', 0);
			slider.attr('max', dates.length);
			slider.css('width', '500px');
			slider.change(function (event, value) {
				intro = false;
				reanimate(slider.attr('value'));
			});	

			$('#sliderDIV').append(slider);


     	var delay
        , dateIndex = 0
        , animate = function (key, grouped) {
          jQuery('#date').text(key);
          svg.selectAll("path")
            .transition().duration(800)
            .style("fill", function(d) {
              if(!grouped[key][d.properties.name]) 
                return "#ccc";
              return fill(grouped[key][d.properties.name]);
            });
          dateIndex++;
          setTimeout(function () {
						if(intro) slider.attr('value', dateIndex);
            reanimate(dateIndex);
          }, 800);
        }
        , reanimate = function (i) {
          if (grouped[dates[i]]) {
            animate(dates[i], grouped);
          }
        }

        reanimate(dateIndex); 
		});

	// Legend creation	
			var legendSVG = view.append('g').attr('id', 'legend')
				.attr('transform', 'translate(' + (width - (7 * this.maxValue))  + ', ' + (height-100) + ')');
			legendSVG.append('svg:text').attr('x', -30).attr('y',55).text('0%');
			legendSVG.append('svg:rect').attr('width', 5).attr('height', 20).attr('x', 0).attr('y',40).attr('fill', '#cccccc');
			var numberedArray = [];	
			for(var i=0; i<=this.maxValue; i++) { numberedArray.push(i); }
			var rects = legendSVG.selectAll('rect')
				.data(numberedArray).enter()
				.append('svg:rect')
				.attr('width', 5)
				.attr('height', 20)
				.attr('x', function(d) {return d*6;})
				.attr('y', 40)
				.attr('fill', function(d) { return fill(d); });

			legendSVG.append('svg:text').attr('x', 615).attr('y',55).text('100%');
	
    function redraw() {
      svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }


  }
}
	
function changeDate() {
	console.log($('#slider').attr('value'));	
}	
