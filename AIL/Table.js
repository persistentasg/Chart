
function createRecentTable(id, data) {

	d3.select(id).selectAll("*").remove();

	var table = d3.select(id).append("table").attr("class", "recent_table");
	var thead = table.append("thead");
	var tbody = table.append("tbody");

	// create header row
	thead.append("tr").selectAll("th")
				.data(data.headers)
				.enter()
				.append("th")
				.attr("class", "tableHead")
				.text(function(d) {return d;});

	// create a row for each object
	var rows = tbody.selectAll("tr")
				.data(data.cells)
				.enter()
				.append("tr");

	// create a cell in the row for each field
	var cells = rows.selectAll("td")
				.data(function(row) {
					var index = d3.range(0, data.headers.length, 1); 
					
					return index.map(function(column) {
						return {
							column : column,
							value : row[column],
							name : row[8],
							model : row[9]
						};
					});
				}).enter()
				.append("td")
				.html(function(d) {return d.value})
				.on("mouseover", function(d) {
					var tipHtml = "<table><tr><td><b>Instance:</b></td><td>"+d.name+"</td></tr>"
						+"<tr><td><b>Model:</b></td><td>"+d.model+"</td></tr></table>";
					
					showTooltip(this, tipHtml, false);
				}).on("mouseout", function(d){hideTooltip(this);});

//	tbody.each(function(d,i){
//		var children = d3.selectAll(this.childNodes);
//		console.log(children);
//		console.log("First Child: " + this.firstElementChild);
//	})
}

var drillDownHeaders = ["Task Name", "Application Name", "Status", "Start Time"];

function createDrillDownTable(id, data){

	//console.log("in createDrillDownTable!! Id: " + id);
	//console.log("Data: "+ JSON.stringify(data));
	//console.log(json);
	//var data = JSON.parse(json);
	//console.log(data[0].ownerName);

	d3.select(id).selectAll("*").remove();
	document.getElementById("userGroupSection").style.display = "";
	var title = d3.select(id).append("text").html("<h3>Task Breakdown for "+data[0].ownerName+"</h3>");

	var table = d3.select(id).append("table").attr("class", "recent_table");
	var thead = table.append("thead");
	var tbody = table.append("tbody");

	// create header row
	thead.append("tr").selectAll("th")
				.data(drillDownHeaders)
				.enter()
				.append("th")
				.attr("class", "tableHead")
				.text(function(d) {return d;});

	// create a row for each object
	var rows = tbody.selectAll("tr")
				.data(data[0].tasks);
	
	rows.enter().append("tr");
	
	rows.exit().remove();

	// create a cell in the row for each field
	var cells = rows.selectAll("td")
				.data(function(row) {
					//var index = d3.range(0, drillDownHeaders.length, 1); 
					return drillDownHeaders.map(function(column) {
//						return row.tasks.map(function(task){
							return {
								column : column,
								value : getRowElement(column, row)
							};
//						});
					});
				});
				
	cells.enter()
			.append("td")
			.html(function(d) {return d.value});
//				.on("mouseover", function(d) {
//					var tipHtml = "<table><tr><td><b>Instance:</b></td><td>"+d.name+"</td></tr>"
//						+"<tr><td><b>Model:</b></td><td>"+d.model+"</td></tr></table>";
//					
//					showTooltip(this, tipHtml, false);
//				}).on("mouseout", function(d){hideTooltip(this);});
	
	cells.exit().remove();
}

function getRowElement(column, data){
	
	switch(column){
		case "Task Name":
			return data.name;
		case "Application Name":
			return data.application.applicationName;
		case "Status":
			return data.status;
		case "Start Time":
			return data.startTime;
	}	
}