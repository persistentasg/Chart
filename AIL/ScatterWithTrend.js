// returns slope, intercept and r-square of the line
function leastSquares(xSeries, ySeries) {
	var reduceSumFunc = function(prev, cur) {
		return prev + cur;
	};

	var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
	var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

	var ssXX = xSeries.map(function(d) {
		return Math.pow(d - xBar, 2);
	}).reduce(reduceSumFunc);

	var ssYY = ySeries.map(function(d) {
		return Math.pow(d - yBar, 2);
	}).reduce(reduceSumFunc);

	var ssXY = xSeries.map(function(d, i) {
		return (d - xBar) * (ySeries[i] - yBar);
	}).reduce(reduceSumFunc);

	var slope = ssXY / ssXX;
	var intercept = yBar - (xBar * slope);
	var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

	return [ slope, intercept, rSquare ];
}

function scatterWithTrend(id, data, legendId) {
	
	var margin = {
			top : 20,
			right : 20,
			bottom : 30,
			left : 40
		}, width = 600 - margin.left - margin.right, height = 400 - margin.top
				- margin.bottom;
	
	var xData = "uniqueOwners";
	var yData = "efficency";
	
	var xLabel = "Number of Unique Owners";
	var yLabel = "Efficiency";
	
	var xLabels = data.map(function(d) {
		return d[xData];
	});
	
	var xSeries = d3.range(1, xLabels.length + 1);
	var ySeries = data.map(function(d) {
		return parseFloat(d['efficency']);
	});
	
	console.log("xLabels: " + xLabels);
	console.log("xSeries: " + xSeries);
	
	var xformat = "d";
	var yformat = "%";
	
	var tip = d3.tip().attr("class", "d3-tip")
		.offset([ -10, 0 ]).html(function(d) {
			return "<strong>Application: </strong><span>" + d.application.applicationName + "</span></br>" +
					"<strong># of Completed Tasks: </strong><span>" + d.application.numCompletedTasks + "</span></br>" +
					 "<strong># of Total Tasks: </strong><span>" + d.application.numTotalTasks + "</span>"; 
		});
	
	PointGraph(id, data, width, height, margin, xData, yData, xLabel, yLabel,
			xSeries, ySeries, xformat, yformat, tip, 0, null, true);
}