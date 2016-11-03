var donutsvg;
var arc;
var outerArc;
var arcOver;
var isFirst = true;
// creates a donut chart.
function getDonutChart(id, data){
//	d3.select(id).selectAll("*").remove();
	 
	 var dC ={},    donDim ={w: 150, h: 150}; 
	 
	 

     donDim.r = Math.min(donDim.w, donDim.h) / 3;
     
     // create svg for donut chart.
     donutsvg = d3.select(id)
     	.append("svg")
     	.attr("width", "70%").attr("height", "70%")
     	.attr('viewBox','30 30 90 90')
     	.attr('preserveAspectRatio','xMinYMin')
     	.attr("x", 10)
     	.attr("y", 10)
//     	.attr("display", "inline-block")
     	.append("g");
     
     // create 3 different groups (1 for donut slices, 1 for labels, 1 for lines).
     donutsvg.append("g")
     	.attr("class", "slices");
     donutsvg.append("g")
     	.attr("class", "labels");
     donutsvg.append("g")
     	.attr("class", "lines");
     
     // create function to draw the arcs of the donut slices.
     arc = d3.svg.arc().outerRadius(donDim.r*0.8).innerRadius(donDim.r*0.6);
     
     // define the arc that the labels will lay on.
     outerArc = d3.svg.arc()
		.innerRadius(donDim.r * 0.55)
		.outerRadius(donDim.r * 0.55);
     
     donutsvg.attr("transform", "translate("+Math.min(donDim.w,donDim.h) / 2 + "," + Math.min(donDim.w,donDim.h) / 2+")");
     
     // this key will help in putting the data with the labels.
     var key = function(d){ return d.data.applicationName; };
     
     // define the radius of the arcs after you mouse over them.
     arcOver = d3.svg.arc().outerRadius(donDim.r*0.85).innerRadius(donDim.r*0.6);

     // create a function to compute the donut slice angles.
     var donut = d3.layout.pie().sort(null).value(function(d) {return d.activeProcessCount; });

     // Draw the donut slices.
     var slice = donutsvg.select(".slices").selectAll("slice")
     	.data(donut(data), key);
     
     var txtTip = donutsvg.append("text")
  		.datum(data)
     	.attr("y", -9 + donDim.r/10);
     
     txtTip.append("tspan").attr("x", 1)		
		.attr("id", "text-name")
		.attr("class", "font5")
//		.attr("dy", ".35em")
		.style("text-anchor", "middle");
//		.style("font-size", donDim.r/2.5+"px");
     
     txtTip.append("tspan").attr("x", 1)	
		.attr("id", "text-num")
		.attr("class", "font5")
		.attr("dy", "1.2em")
		.style("text-anchor", "middle");
     
     txtTip.append("tspan").attr("x", 1)	
		.attr("id", "perc-num")
		.attr("class", "font5")
		.attr("dy", "1.4em")
		.style("text-anchor", "middle");
     
     addSlice(data);
     
     // determine the angle that the labels and lines will use
     function midAngle(d){
    	 return d.startAngle + (d.endAngle - d.startAngle)/2;
     }
}

function updateSlices(data){
	 // create a function to compute the donut slice angles.
    var donut = d3.layout.pie().sort(null).value(function(d) {return d.activeProcessCount; });
    
    // this key will help in putting the data with the labels.
    var key = function(d){ return d.data.applicationName; };
    
    var slice = donutsvg.select(".slices")
	.selectAll(".slice")
	.data(donut(data), key);
    
    slice.transition().duration(100);
    slice.exit().transition().duration(100).remove();
}

function addSlice(data){
	 // create a function to compute the donut slice angles.
    var donut = d3.layout.pie().sort(null).value(function(d) {return d.activeProcessCount; });
    
    // this key will help in putting the data with the labels.
    var key = function(d){ return d.data.applicationName; };

    var slice = donutsvg.select(".slices")
    		.selectAll("slice")
    		.data(donut(data), key);
    
    
	slice.enter()
		.insert("path")
 	.attr("class", "slice")
 	.attr("d", arc)
    .each(function(d) { this._current = d; 
	    if(isFirst){ d3.select(this)
		    	.attr("stroke","white")
	        	.transition()
	            .duration(250)
	            .attr("d", arcOver)
	        	.attr("stroke-width",2)
	        	.attr("id", "firstSlice");
	    
		    donutsvg.select("#text-name")
			.text(function(c) {return d.data.applicationName;});
    	
		    donutsvg.select("#text-num")
	    		.text(function(c) {return d.data.activeProcessCount + " Active Processes";});
	    	
	    	var percent = (d.data.activeProcessCount/d.data.totalProcessCount)*100;
	    	donutsvg.select("#perc-num")
				.text(function(c) {return percent.toFixed(2) + " %";});
	    
	    	isFirst = false;}
	    	})
    .style("fill", function(d) { return color(d.data.applicationName); })
    .on("mouseover", function(d) {
    	d3.select("#firstSlice").transition()
	    .duration(250)
	    .attr("d", arc)
	    .attr("stroke","none");
    	donutsvg.select("#text-name")
			.text(function(c) {return d.data.applicationName;});
    	
    	donutsvg.select("#text-num")
    		.text(function(c) {return d.data.activeProcessCount + " Active Processes";});
    	
    	var percent = (d.data.activeProcessCount/d.data.totalProcessCount)*100;
    	donutsvg.select("#perc-num")
			.text(function(c) {return percent.toPrecision(4) + " %";});
	    
	    d3.select(this)
	    	.attr("stroke","white")
        	.transition()
            .duration(250)
            .attr("d", arcOver)
        	.attr("stroke-width",2);
    })
    .on("mouseout", function(d) {
//    	hideTooltip(this);
    	
    	donutsvg.select("#text-name").text("");
    	donutsvg.select("#text-num").text("");
    	donutsvg.select("#perc-num").text("");
    	
    	d3.select(this)
			.transition()
		    .duration(250)
		    .attr("d", arc)
		    .attr("stroke","none");
    	
    	d3.select('#firstSlice')
		.attr("stroke","white")
		.transition()
	    .duration(250)
	    .attr("d", arcOver)
		.attr("stroke-width",2);
	
    	var firstData = d3.select('#firstSlice').data();
//	var firstData = d3.select('#firstSlice').map(function(d) { return d.__data__; });
	donutsvg.select("#text-name")
	.text(firstData[0].data.applicationName);
	
	donutsvg.select("#text-num")
		.text(firstData[0].data.activeProcessCount + " Active Processes");
	
	var percent = (firstData[0].data.activeProcessCount/firstData[0].data.totalProcessCount)*100;
	donutsvg.select("#perc-num")
		.text(percent.toFixed(2) + " %");
    });
}