function buildPerformanceBubbleChart(id, data){
	
	var margin = {
			top : 20,
			right : 20,
			bottom : 30,
			left : 40
		}, width = 600 - margin.left - margin.right, height = 400 - margin.top
				- margin.bottom;
		
	var xData = "averagePercentWaiting";
	var yData = "averageLagDuration";
	
	var xLabel = "Percent of Time Spent Waiting";
	var yLabel = "Average Lag Duration In Hours";
	
	var xSeries = data.map(function(d) {
		return parseFloat(d[xData]);
	});
	var ySeries = data.map(function(d) {
		return parseFloat(d[yData]);
	});
	
	var xformat = "%";
	var yformat = "s";
	
	var tip = d3.tip().attr("class", "d3-tip").offset([ -10, 12 ]).html(
			function(d) {
				return "<table><tr><td><b>Application:</b></td><td>" + d.applicationName + "</td></tr>" +
						"<tr><td><b>Number of Active Processes:</b></td><td>" + d.activeProcessCount + "</td></tr>" +
						"<tr><td><b>"+xLabel+":</b></td><td>" + (d.averagePercentWaiting * 100).toFixed(2)+"%</td></tr>" +
						"<tr><td><b>"+yLabel+":</b></td><td>" + d.averageLagDuration + "</td></tr></table>";	
			});
	
	PointGraph(id, data, width, height, margin, xData, yData, xLabel, yLabel,
			xSeries, ySeries, xformat, yformat, tip, 25, "activeProcessCount", false);
}