jQuery(function($) {

	var jWebSocketClient = null;
	var lineChartData = [];
	var	pieChartData = [{airline:"NONE", passengers:1}];
	
	var pieChart = new AmCharts.AmPieChart();
  pieChart.dataProvider = pieChartData;
  pieChart.titleField = "airline";
  pieChart.valueField = "passengers";
  pieChart.outlineColor = "#FFFFFF";
  pieChart.outlineAlpha = 0.8;
  pieChart.outlineThickness = 2;
	pieChart.labelRadius = -30;
  pieChart.labelText = "[[percents]]%";
	pieChart.dataChanged = true;
	pieChart.radius = 115;
	pieChart.startDuration = 0;

  pieChart.write("pieChartDiv");
	
	var lineChart = new AmCharts.AmSerialChart();
	lineChart.dataProvider = lineChartData;
  lineChart.marginRight = 5;
  lineChart.marginLeft = 5;
	lineChart.marginTop = 5;
	lineChart.marginBottom = 5;	
  lineChart.categoryField = "DATE";
	
	var categoryAxis = lineChart.categoryAxis;
  categoryAxis.parseDates = true;
  categoryAxis.minPeriod = "ss";
  categoryAxis.dashLength = 5;
  categoryAxis.gridAlpha = 0.15;
  categoryAxis.axisColor = "#DADADA";
  categoryAxis.dateFormats = [{period: "ss",format: "JJ:NN:SS"}, {period: "mm",format: "JJ:NN:SS"}];
	
	var valueAxis = new AmCharts.ValueAxis();
  valueAxis.gridAlpha = 0;
  valueAxis.axisColor = "#DADADA";
  valueAxis.axisThickness = 1;
  valueAxis.inside = true;
  lineChart.addValueAxis(valueAxis);
	
	var landingGraph = new AmCharts.AmGraph();
  landingGraph.valueAxis = valueAxis;
  landingGraph.type = "smoothedLine";
  landingGraph.bullet = "round";
  landingGraph.bulletColor = "#FFFFFF";
  landingGraph.bulletBorderColor = "#FF0F00";
  landingGraph.bulletBorderThickness = 2;
  landingGraph.bulletSize = 5;
  landingGraph.title = "Landing";
  landingGraph.valueField = "LANDING";
  landingGraph.lineColor = "#FF0F00";
  landingGraph.lineThickness = 2;
  lineChart.addGraph(landingGraph);

  var boardingGraph = new AmCharts.AmGraph();
	boardingGraph.valueAxis = valueAxis;
  boardingGraph.type = "smoothedLine";
	boardingGraph.bullet = "round";
  boardingGraph.bulletColor = "#FFFFFF";
	boardingGraph.bulletBorderColor = "#FF6600";
	boardingGraph.bulletBorderThickness = 2;
	boardingGraph.bulletSize = 5;         
	boardingGraph.title = "Boarding";
	boardingGraph.valueField = "BOARDING";
	boardingGraph.lineColor = "#FF6600";
	boardingGraph.lineThickness = 2;
	lineChart.addGraph(boardingGraph);

	var takingOffGraph = new AmCharts.AmGraph();
  takingOffGraph.valueAxis = valueAxis;
	takingOffGraph.type = "smoothedLine";
  takingOffGraph.bullet = "round";
	takingOffGraph.bulletColor = "#FFFFFF";
	takingOffGraph.bulletBorderColor = "#FF9E01";
	takingOffGraph.bulletBorderThickness = 2;
	takingOffGraph.bulletSize = 5;         
	takingOffGraph.title = "Taking Off";
	takingOffGraph.valueField = "TAKING_OFF";
	takingOffGraph.lineColor = "#FF9E01";
	takingOffGraph.lineThickness = 2;
	lineChart.addGraph(takingOffGraph);

	lineChart.write("lineChartDiv");
	
	function parseChartData(stream) {
		
	  	var streamData = jQuery.parseJSON(stream);
			
			pieChartData.splice(0,streamData.list.length);
			
			$.each(streamData.list, function(index,record) {
				pieChartData.push({"airline":record.airline, "passengers":record.passengers});				
			});
		
			pieChart.validateData();
			
     	if (lineChartData.length > 5) {
				lineChartData.splice(0,1);
     	}
		
	  	$('#cnt-landing').text(streamData.CNT_LANDING);
 	  	$('#cnt-boarding').text(streamData.CNT_BOARDING);
 	  	$('#cnt-taking-off').text(streamData.CNT_TAKING_OFF);

	  	$('#ave-landing').text(streamData.AVE_LANDING);
 	  	$('#ave-boarding').text(streamData.AVE_BOARDING);
 	  	$('#ave-taking-off').text(streamData.AVE_TAKING_OFF);
			
			if (streamData.CNT_LANDING > parseInt($('#max-landing').text())) {
				$('#max-landing').text(streamData.CNT_LANDING);
			}
			
			if (streamData.CNT_BOARDING > parseInt($('#max-boarding').text())) {
				$('#max-boarding').text(streamData.CNT_BOARDING);
			}
			
  		if (streamData.CNT_TAKING_OFF > parseInt($('#max-taking-off').text())) {
				$('#max-taking-off').text(streamData.CNT_TAKING_OFF);
			}
		
     	lineChartData.push(
	  		{DATE:new Date(),
				 LANDING:streamData.CNT_LANDING,
				 BOARDING:streamData.CNT_BOARDING,
				 TAKING_OFF:streamData.CNT_TAKING_OFF});
				 
			lineChart.validateData();

	}

	function disconnect() {
		
		if(jWebSocketClient) {
			jWebSocketClient.stopKeepAlive();
			var result = jWebSocketClient.close();
			
			if (result.code == 0) {
				$('#alert-div').html('').removeClass().addClass("alert alert-info");
				$('#alert-div').html('<strong>Info!</strong> jWebSocket disconnected');
			} else {
				$('#alert-div').html('').removeClass().addClass("alert alert-error");
				$('#alert-div').html('<strong>Info!</strong> Error while disconnecting');
			}
		}
	}

	function registerStream() {
		var stream = "chartStream";
		var result = jWebSocketClient.registerStream(stream);
		result = jWebSocketClient.resultToString(result);
		$('#alert-div').html('').removeClass().addClass("alert alert-success");
		$('#alert-div').html('<strong>Info!</strong> jWebSocket connection established " + result');
	}

	
	/* Main Code */
	
	if(jws.browserSupportsWebSockets()) {
  		jWebSocketClient = new jws.jWebSocketJSONClient();
  	} else {
			$('#alert-div').html('').removeClass().addClass("alert alert-error");
			$('#alert-div').html('<strong>Error!</strong> ' + jws.MSG_WS_NOT_SUPPORTED);			
	}
	
	$('#connect').toggle(function() {
		var URL = jws.getDefaultServerURL();

		try {
			var result = jWebSocketClient.logon(URL, jws.GUEST_USER_LOGINNAME, jws.GUEST_USER_PASSWORD, {
				OnOpen: function(levent) {
				},
			  OnWelcome: function(levent) {
					registerStream();
    		},  
				OnMessage: function(levent, token) {
					if(jWebSocketClient.isLoggedIn()) {
						parseChartData(levent.data);
						$('#alert-div').html('').removeClass().addClass("alert alert-info");
						$('#alert-div').html('<strong>Info!</strong> ' + levent.data);
					} else {
						$('#alert-div').html('').removeClass().addClass("alert alert-info");
						$('#alert-div').html('<strong>Info!</strong> Authentication process...');
					}
				},
				OnClose: function(levent) {
					$('#alert-div').html('').removeClass().addClass("alert alert-info");
					$('#alert-div').html('<strong>Info!</strong> jWebSocket connection closed.');
				}
			}); // jWebSocketClient.logon
		} catch(e) {
			console.log("Exception: " + e.message );
		}
		
		$('#connect').text('Disconnect');
	}, 
	function() {
		disconnect();
		$('#connect').text('Connect');
	});
	
}); // jQuery(function($)

$(document).unload(function() {
	jWebSocketClient.stopKeepAlive();
	disconnect();
}); //$(document).unload