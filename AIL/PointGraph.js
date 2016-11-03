function PointGraph(id, data, width, height, margin, xData, yData, xLabel, yLabel, xSeries, ySeries, xformat, yformat, tip, 
		scalefactor, activeProcessCount, hasTrend){

	d3.selectAll(".d3-tip").remove();
	
	var x = d3.scale.linear().range([ 0, width ]);

	var y = d3.scale.linear().range([ height, 0 ]);

	var xAxis = d3.svg.axis().scale(x).tickFormat(d3.format(xformat)).orient("bottom");

	var yAxis = d3.svg.axis().scale(y).tickFormat(d3.format(yformat)).orient("left");

	var svg = d3.select(id).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	data.forEach(function(d) {
		d[yData] = +d[yData];
		d[xData] = +d[xData];
	});
	
	x.domain( d3.extent(data, function(d) {return d[xData];})).nice();

	y.domain( d3.extent(data, function(d) {return d[yData];})).nice();
	
	svg.call(tip);
	
	svg.append("g").attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
		.attr("class", "label")
		.attr("class", "font10")
		.attr("x", width)
		.attr("y", -6)
		.attr("font-size", "20px")
		.style("text-anchor", "end")
		.text(xLabel);

	svg.append("g").attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("x", 5)
		.attr("y", 6)
		.attr("font-size", "20px")
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text(yLabel);

	svg.selectAll(".point")
		.data(data)
		.enter()
		.append("circle")
		.attr("class", "point")
		.attr("r", function(d) {
			return (scalefactor > 0 ? Math.sqrt(d[activeProcessCount] * scalefactor) : 9);
		})
		.attr("cx", function(d) {return x(d[xData]);})
		.attr("cy", function(d) {return y(d[yData]);})
		.style("fill", function(d) {
			
			var appName;
			
			getAppName(d, "applicationName");
			
			function getAppName(obj, name) {
				for (var key in obj) {
					if (obj.hasOwnProperty(key)) {
						if("object" == typeof(obj[key])) {
							getAppName(obj[key], name);
						} else if (key == name) {
							appName = obj[key];
						}
					}
				}
			}
			
			return color(appName);
		})
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);
	
	// If the graph has a trend line, do the necessary calculations with the data provided to produce it.
	if (hasTrend) {
		// apply the reults of the least squares regression
		var leastSquaresCoeff = leastSquares(xSeries, ySeries);
		var x1 = x.domain()[0];
		var y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
		var x2 = x.domain()[x.domain().length - 1];
		var y2 = leastSquaresCoeff[0] * xSeries.length + leastSquaresCoeff[1];
		var trendData = [ [ x1, y1, x2, y2 ] ];
		
		var trendLine = svg.selectAll(".trendline").data(trendData);
		
		trendLine.enter().append("line")
			.attr("class", "trendline")
			.attr("x1",	function(d) {return x(d[0]);})
			.attr("y1", function(d) {return y(d[1]);})
			.attr("x2", function(d) {return x(d[2]);})
			.attr("y2", function(d) {return y(d[3]);})
			.attr("stroke", "#cccccc")
			.attr("opacity", ".2")
			.attr("stroke-width", 5);
		
		svg.append("text").text("Trendline")
			.attr("class", "text-label")
			.attr("x",function(d) {return x(x2) - 60;})
			.attr("y", function(d) {return y(y2) - 10;});
	}
}