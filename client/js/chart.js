var jWebSocketClient = null;

var pieChart;
var lineChart;
	
var lineChartData = [];


function parsePieChartData(stream) {
	
	var streamData = jQuery.parseJSON(stream);
	var pieDataProvider = [];

	$.each(streamData.query, function(intIndex, objValue) {
		var status = objValue.status;
		var count = objValue.count;

		var pieObject = {status:status, count:count};
		pieDataProvider.push(pieObject);
	});
 
	pieChart.dataProvider = pieDataProvider;
	pieChart.colors = ["#FF0F00", "#FF6600", "#FF9E01"];
	pieChart.validateData();
}


function parseLineChartData(stream) {
	
	var streamData = jQuery.parseJSON(stream);
	var temp = [];
	
	if (lineChartData.length > 5) {
		lineChartData.splice(0,1);
	}

	lineChartData.push(
		{
		 date:new Date(), 
		 OPEN:Math.round(Math.random() * 40) + 100, 
		 CLOSED:Math.round(Math.random() * 80) + 500,
		 INIT:Math.round(Math.random() * 6000)
		}
	);
	
	temp = lineChartData;
				$('#log').html("");
			$('#log').html("temp " + temp.length);		
			
	lineChart.dataProvider = temp;
	lineChart.validateData();
	
} // function parseLineChartData(stream)


function disconnect() {
	if(jWebSocketClient) {
		jWebSocketClient.stopKeepAlive();
		var result = jWebSocketClient.close();
		if (result.code == 0) {					
			$('#log').html("");
			$('#log').html("jWebSocket disconnected");			
		} else {
			$('#log').html("");
			$('#log').html("Error while disconnecting");						
		}
	}
}


$(document).ready(function() {
	
	AmCharts.ready(function() {
		/***********************************
		** Pie Chart                      **
		***********************************/
		pieChart = new AmCharts.AmPieChart();
		pieChart.dataProvider = [{status: "OFFLINE", count: 1}];	
		pieChart.colors = ["#CCCCCC"];
		pieChart.titleField = "status";
		pieChart.valueField = "count";
		pieChart.outlineColor = "#FFFFFF";
		pieChart.outlineAlpha = 0.8;
		pieChart.outlineThickness = 2;
 		pieChart.labelRadius = -30;
		pieChart.labelText = "[[percents]]%";
		
		pieChart.write("pieChartDiv");	
		
		
		/***********************************
		** Line Chart                      **
		***********************************/
		lineChart = new AmCharts.AmSerialChart();
      lineChart.dataProvider = lineChartData;
      lineChart.categoryField = "date";
		 
		
		var categoryAxis = lineChart.categoryAxis;
		categoryAxis.parseDates = true;
		categoryAxis.minPeriod = "ss";
		categoryAxis.dashLength = 2;
		categoryAxis.gridAlpha = 0.15;
		categoryAxis.axisColor = "#DADADA";
		categoryAxis.dateFormats = [{period: "ss",format: "JJ:NN:SS"}];
		/*
		,
			{period: "DD",format: "DD"},
			{period: "WW",format: "MMM DD"},
			{period: "MM",format: "MMM"},
			{period: "YYYY",format: "YYYY"}
		];
		*/             

      var valueAxis1 = new AmCharts.ValueAxis();
      valueAxis1.gridAlpha = 0;
      valueAxis1.axisColor = "#FF6600";
      valueAxis1.axisThickness = 2;
		valueAxis1.logarithmic = true;
      lineChart.addValueAxis(valueAxis1);

      var valueAxis2 = new AmCharts.ValueAxis();
      valueAxis2.gridAlpha = 0;
      valueAxis2.axisColor = "#FCD202";
      valueAxis2.axisThickness = 2;
		valueAxis2.position = "right"
		valueAxis2.logarithmic = true;
      lineChart.addValueAxis(valueAxis2);

      var valueAxis3 = new AmCharts.ValueAxis();
      valueAxis3.gridAlpha = 0;
      valueAxis3.axisColor = "#B0DE09";
      valueAxis3.axisThickness = 2;
		valueAxis3.offset = 50;
      lineChart.addValueAxis(valueAxis3);
		
		var graph1 = new AmCharts.AmGraph();
      graph1.valueAxis = valueAxis1;
      graph1.title = "Open";
      graph1.valueField = "OPEN";
      graph1.hideBulletsCount = 30;
      lineChart.addGraph(graph1);

      var graph2 = new AmCharts.AmGraph();
      graph2.valueAxis = valueAxis2;
      graph2.title = "Closed";
      graph2.valueField = "CLOSED";
      graph2.hideBulletsCount = 30;
      lineChart.addGraph(graph2);

      var graph3 = new AmCharts.AmGraph();
      graph3.valueAxis = valueAxis3;
      graph3.title = "Init";
      graph3.valueField = "INIT";
      graph3.hideBulletsCount = 30;
      lineChart.addGraph(graph3);

		lineChart.write("lineChartDiv");
	});
	
	
	if (window.WebSocket) {
		jWebSocketClient = new jws.jWebSocketJSONClient();
	} else {
		message = jws.MSG_WS_NOT_SUPPORTED;
		alert(message);
	}

	
	$('#connect').click(function() {
		var URL = jws.getDefaultServerURL();
		
		try {
			var result = jWebSocketClient.logon(URL, jws.GUEST_USER_LOGINNAME, jws.GUEST_USER_PASSWORD, {
				OnOpen: function(levent) {
					$('#log').html("");
					$('#log').html("jWebSocket connection established");			
				},
			   OnWelcome: function(levent) {
					var stream = "chartStream";
					result = jWebSocketClient.registerStream(stream);
					//alert("Result Register: " + jWebSocketClient.resultToString(result));
    			},  
				OnMessage: function(levent) {
					if(jWebSocketClient.isLoggedIn()) {
						parsePieChartData(levent.data);
						parseLineChartData(levent.data);
					} else {
						$('#log').html("");
						$('#log').html("conected");		
					}
				},
				OnClose: function(levent) {
					$('#log').html("");
					$('#log').html("jWebSocket connection closed.");										
				}
			}); // jWebSocketClient.logon()
		} catch(e) {
			alert("Exception: " + e.message );
		}
	}); // $('#connect').click(function()

	
	$('#disconnect').click(function() {
		disconnect();
		pieChart.colors = ["#CCCCCC"];
		pieChart.dataProvider = [{status: "OFFLINE", count: 1}];
		pieChart.validateData();		
	}); // $('#disconnect').click(function() 


	$(document).unload(function() {
		jWebSocketClient.stopKeepAlive();
		disconnect();
	}); //$(document).unload(function() 	

	
}); // $(document).ready(function

