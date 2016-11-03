var orgDataDay;
var orgData24Day;
var orgDataNight;
var orgData24Night;
var isNewDataDay = true;
var isNewDataNight = true;
var isNewData24Day = true;
var isNewData24Night = true;

function refreshData(){
	isNewDataDay = true;
	isNewDataNight = true;
	isNewData24Day = true;
	isNewData24Night = true;
}

function initClockData(data, data24){
//	console.log("Init Clock Data...");
	orgDataDay = data.dayClock;
//	console.log("all Day: "+orgDataDay.length);
	orgData24Day = data24.dayClock;
//	console.log("daily Day: "+orgData24Day.length);
	orgDataNight = data.nightClock;
//	console.log("all Night: "+orgDataNight.length);
	orgData24Night = data24.nightClock;
//	console.log("daily Night: "+orgData24Night.length);
}

function buildClock(id, data, legendId, timeSpan) {
//	console.log("Building Clock!")
//	d3.select(id).selectAll("*").remove();
//	d3.select(legendId).selectAll("*").remove();

	var day_night = id.substring(1, id.length);
	data = updateData(data, timeSpan, day_night);
	
	var width = 400, height = 300;

	var svg = d3.select(id).append("svg")
			.attr("id", id.substring(1, id.length))
			.attr("class", "clock")
			.attr("viewBox", "0 0 100 100")
			.attr("width", "100%")
			.attr("height", "100%")
			.style("z-index", "-1");

	var clockFace = svg.append("circle")
			.attr("id", "face")
			.attr("cx", 50)
			.attr("cy", 50)
			.attr("r", 45);

	var ticks = svg.append("g").attr("id", "ticks");

	ticks.selectAll("line")
			.data(lineData.data)
			.enter()
			.append("line")
			.attr("x1", function(d) {return d.x1})
			.attr("y1", function(d) {return d.y1})
			.attr("x2", function(d) {return d.x2})
			.attr("y2", function(d) {return d.y2});

	if (id.substring(1, id.length) == "dayClock") {
		var numbers = svg.append("g").attr("id", "dayNumbers");
	} else {
		var numbers = svg.append("g").attr("id", "nightNumbers");
	}

	numbers.selectAll("text")
			.data(numValues.data)
			.enter()
			.append("text")
			.attr("x", function(d) {return d.x})
			.attr("y", function(d) {return d.y})
			.text(function(d) {return d.value});

	var circles = svg.append("g").attr("id", "circles");

	if(data != null){
	circles.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
			.attr("cx", function(d) {return d.cx})
			.attr("cy", function(d) {return d.cy;})
			.attr("r", function(d) {return d.r;})
			.style("fill", function(d) {return color(d.applicationName);})
			.on("mouseover", function(d) {
				var tipHtml = "<table><tr><td><b>Application:</b></td><td>"+d.applicationName+"</td></tr>" 
				+"<tr><td><b>Day:</b></td><td>"+d.day+"</td>"
				+"<tr><td><b>Time:</b></td><td>"+d.time+"</td>"
				+"<tr><td><b>Task:</b></td><td>"+d.task+"</td>"
				+"<tr><td><b>Assignee:</b></td><td>"+d.person+"</td></table>";
				
				showTooltip(this, tipHtml, false);
			}).on("mouseout", function(d) {hideTooltip(this);})
	}
}

function updateClock(id, data, timeSpan){
	
	var day_night = id.substring(1, id.length);
//	console.log(day_night);
//	console.log(timeSpan);

	data = updateData(data, timeSpan, day_night);
	if(data == null){
		data = "";
	}
	var svg = d3.select("#"+id.substring(1, id.length));
	var circles = svg.select("#circles")
			.selectAll("circle")
			.data(data);

	circles.enter()
			.append("circle")
			.attr("cx", function(d) {return d.cx;})
			.attr("cy", function(d) {return d.cy;})
			.attr("r", function(d) {return d.r})
			.style("fill", function(d) {return color(d.applicationName);})
			.on("mouseover", function(d) {
				var tipHtml = "<table><tr><td><b>Application:</b></td><td>"+d.applicationName+"</td></tr>" 
				+"<tr><td><b>Day:</b></td><td>"+d.day+"</td>"
				+"<tr><td><b>Time:</b></td><td>"+d.time+"</td>"
				+"<tr><td><b>Task:</b></td><td>"+d.task+"</td>"
				+"<tr><td><b>Assignee:</b></td><td>"+d.person+"</td></table>";
	
				showTooltip(this, tipHtml, false);
			}).on("mouseout", function(d) {hideTooltip(this);})
			
	circles.exit().remove();
}

function updateData(data, timeSpan, day_night){
	
	switch(timeSpan){
	case('dailyClockData'):
		if(data != null){
			if(day_night == 'dayClock'){
//				console.log('Updating OrgData24 Day');
				if(isNewData24Day){
					orgData24Day = orgData24Day.concat(data);
					isNewData24Day = false;
				}
				data = orgData24Day;
			}else{
//				console.log('Updating OrgData24 Night');
				if(isNewData24Night){
					orgData24Night = orgData24Night.concat(data);
					isNewData24Night = false;
				}
				data = orgData24Night;
			}
		}
		break;
		
	case('allClockData'):
		if(data != null){
			if(day_night == 'dayClock'){
//				console.log('Updating OrgData Day');
				if(isNewDataDay){
					orgDataDay = orgDataDay.concat(data);
					isNewDataDay = false;
				}
				data = orgDataDay;
			}else{
//				console.log('Updating OrgData Night');
				if(isNewDataNight){
					orgDataNight = orgDataNight.concat(data);
					isNewDataNight = false;
				}
				data = orgDataNight;
			}
		}
		break;
}
	
	return data;
}

var lineData = {
		"data" : [ {
			"x1" : 50.00,
			"y1" : 5.00,
			"x2" : 50.00,
			"y2" : 10.00
		}, {
			"x1" : 72.50,
			"y1" : 11.03,
			"x2" : 70.00,
			"y2" : 15.36
		}, {
			"x1" : 88.97,
			"y1" : 27.50,
			"x2" : 84.64,
			"y2" : 30.00
		}, {
			"x1" : 95.00,
			"y1" : 50.00,
			"x2" : 90.00,
			"y2" : 50.00
		}, {
			"x1" : 88.97,
			"y1" : 72.50,
			"x2" : 84.64,
			"y2" : 70.00
		}, {
			"x1" : 72.50,
			"y1" : 88.97,
			"x2" : 70.00,
			"y2" : 84.64
		}, {
			"x1" : 50.00,
			"y1" : 95.00,
			"x2" : 50.00,
			"y2" : 90.00
		}, {
			"x1" : 27.50,
			"y1" : 88.97,
			"x2" : 30.00,
			"y2" : 84.64
		}, {
			"x1" : 11.03,
			"y1" : 72.50,
			"x2" : 15.36,
			"y2" : 70.00
		}, {
			"x1" : 5.00,
			"y1" : 50.00,
			"x2" : 10.00,
			"y2" : 50.00
		}, {
			"x1" : 11.03,
			"y1" : 27.50,
			"x2" : 15.36,
			"y2" : 30.00
		}, {
			"x1" : 27.50,
			"y1" : 11.03,
			"x2" : 30.00,
			"y2" : 15.36
		} ]
	};

	var numValues = {
		"data" : [ {
			"x" : 50,
			"y" : 18,
			"value" : 12
		}, {
			"x" : 85,
			"y" : 53,
			"value" : 3
		}, {
			"x" : 50,
			"y" : 88,
			"value" : 6
		}, {
			"x" : 15,
			"y" : 53,
			"value" : 9
		}

		]

	}
