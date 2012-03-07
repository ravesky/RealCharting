var jWebSocketClient = null;
var lineChart = null;
var lineChartData = [];

jQuery(function($) {
	
	function logger(message) {
   	$('#footer_message').text(message).slideDown().delay(500).slideUp();
	}

	function parseChartData(stream) {
     
	  	var streamData = jQuery.parseJSON(stream);
    
     	if (lineChartData.length > 5) {
			lineChartData.splice(0,1);
     	}
	  
	  	$('#landing').text(streamData.LANDING);
  	  	$('#boarding').text(streamData.BOARDING);
  	  	$('#taking_off').text(streamData.TAKING_OFF);

     	lineChartData.push(
	  		{DATE:new Date(streamData.DATE),
			LANDING:streamData.LANDING,
			BOARDING:streamData.BOARDING,
			TAKING_OFF:streamData.TAKING_OFF}
			);

		lineChart.validateData();
	}

	function disconnect() {
		
		if(jWebSocketClient) {
			jWebSocketClient.stopKeepAlive();
			var result = jWebSocketClient.close();
			
			if (result.code == 0) {
				logger("jWebSocket disconnected");
			} else {
				logger("Error while disconnecting");
			}
		}
	}

	function registerStream() {
		var stream = "chartStream";
		var result = jWebSocketClient.registerStream(stream);
		result = jWebSocketClient.resultToString(result);
		logger("jWebSocket connection established " + result);
	}


	
	if(jws.browserSupportsWebSockets()) {
  		jWebSocketClient = new jws.jWebSocketJSONClient();
  	} else {
   	var message = jws.MSG_WS_NOT_SUPPORTED;
	 	logger(message);
	}
	
	$('#connect').click(function() {
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
					} else {
						logger("Authentication process.");
					}
				},
				OnClose: function(levent) {
					logger("jWebSocket connection closed");
				}
			}); // jWebSocketClient.logon
		} catch(e) {
			logger("Exception: " + e.message );
		}
	}); // $('#connect').click

	
	$('#disconnect').click(function() {
		disconnect();
	}); // $('#disconnect').click

}); // jQuery(function($)


$(document).unload(function() {
	jWebSocketClient.stopKeepAlive();
	disconnect();
}); //$(document).unload



AmCharts.ready(function () {
	
	lineChart = new AmCharts.AmSerialChart();
	lineChart.dataProvider = lineChartData;
   lineChart.marginRight = 5;
   lineChart.marginLeft = 10;
	lineChart.marginTop = 5;
	lineChart.marginBottom = 5;	
   lineChart.categoryField = "DATE";
	
	var categoryAxis = lineChart.categoryAxis;
   categoryAxis.parseDates = true;
   categoryAxis.minPeriod = "ss";
   categoryAxis.dashLength = 2;
   categoryAxis.gridAlpha = 0.15;
   categoryAxis.axisColor = "#DADADA";
   categoryAxis.dateFormats = [{period: "ss",format: "JJ:NN:SS"}, {period: "mm",format: "JJ:NN:SS"}];
	
	var valueAxis = new AmCharts.ValueAxis();
   valueAxis.gridAlpha = 0;
   valueAxis.axisColor = "#DADADA";
   valueAxis.axisThickness = 2;
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

	lineChart.write("chartdiv");

});