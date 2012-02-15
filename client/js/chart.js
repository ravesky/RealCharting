var jWebSocketClient = null;

var pieChart;
var lineChart;

var lineChartData = [
			{date:new Date(2012,1,14,12,12,12),"OPEN":33,"CLOSED":10,"INIT":30},
			{date:new Date(2012,1,14,12,12,13),"OPEN":20,"CLOSED":20,"INIT":20},
			{date:new Date(2012,1,14,12,12,14),"OPEN":40,"CLOSED":36,"INIT":60},
			{date:new Date(2012,1,14,12,12,15),"OPEN":50,"CLOSED":26,"INIT":56},
			{date:new Date(2012,1,14,12,12,16),"OPEN":20,"CLOSED":21,"INIT":33},
			{date:new Date(2012,1,14,12,12,17),"OPEN":4,"CLOSED":23,"INIT":13}];


function parsePieChartData(stream) {
	
	var streamData = jQuery.parseJSON(stream);
	
	var pieDataProvider = [
		{status:"OPEN", count:streamData.OPEN},
		{status:"CLOSED", count:streamData.CLOSED},
		{status:"INIT", count:streamData.INIT}
	];
	
 	pieChart.colors = ["#FF0F00", "#FF6600", "#FF9E01"];
	pieChart.dataProvider = pieDataProvider;
	pieChart.validateData();
}


function parseLineChartData(stream) {
	
	var streamData = jQuery.parseJSON(stream);
	
	if (lineChartData.length > 5) {
		lineChartData.splice(0,1);
	}
			
	lineChartData.push(
		{
		 date:new Date(),
		 OPEN:streamData.OPEN, 
		 CLOSED:streamData.CLOSED,
		 INIT:streamData.INIT
		}
	);
	
	lineChart.validateData();
	
} // function parseLineChartData(stream)


function disconnect() {
	if(jWebSocketClient) {
		jWebSocketClient.stopKeepAlive();
		var result = jWebSocketClient.close();
		if (result.code == 0) {
			log("jWebSocket disconnected");
		} else {
			log("Error while disconnecting");
		}
	}
}

function log(message) {
	$('#top_message').text(message).slideDown().delay(500).slideUp();
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
		lineChart.marginRight = 5;
		lineChart.marginLeft = 5;
      lineChart.categoryField = "date";
		 
		
		var categoryAxis = lineChart.categoryAxis;
		categoryAxis.parseDates = true;
		categoryAxis.minPeriod = "ss";
		categoryAxis.dashLength = 2;
		categoryAxis.gridAlpha = 0.15;
		categoryAxis.axisColor = "#DADADA";
		categoryAxis.dateFormats = [{period: "ss",format: "JJ:NN:SS"}];

      var valueAxis = new AmCharts.ValueAxis();
      valueAxis.gridAlpha = 0;
      valueAxis.axisColor = "#DADADA";
      valueAxis.axisThickness = 2;
		//valueAxis.logarithmic = true;
		valueAxis.inside = true;
      lineChart.addValueAxis(valueAxis);

		var graph1 = new AmCharts.AmGraph();
      graph1.valueAxis = valueAxis;
		graph1.type = "smoothedLine";
      graph1.bullet = "round";
      graph1.bulletColor = "#FFFFFF";
      graph1.bulletBorderColor = "#FF0F00";
      graph1.bulletBorderThickness = 2;
      graph1.bulletSize = 5;
      graph1.title = "Open";
      graph1.valueField = "OPEN";
		graph1.lineColor = "#FF0F00";
		graph1.lineThickness = 2;
      lineChart.addGraph(graph1);

      var graph2 = new AmCharts.AmGraph();
      graph2.valueAxis = valueAxis;
		graph2.type = "smoothedLine";
      graph2.bullet = "round";
      graph2.bulletColor = "#FFFFFF";
      graph2.bulletBorderColor = "#FF6600";
      graph2.bulletBorderThickness = 2;
      graph2.bulletSize = 5;		
      graph2.title = "Closed";
      graph2.valueField = "CLOSED";
		graph2.lineColor = "#FF6600";
		graph2.lineThickness = 2;
      lineChart.addGraph(graph2);

      var graph3 = new AmCharts.AmGraph();
      graph3.valueAxis = valueAxis;
		graph3.type = "smoothedLine";
      graph3.bullet = "round";
      graph3.bulletColor = "#FFFFFF";
      graph3.bulletBorderColor = "#FF9E01";
      graph3.bulletBorderThickness = 2;
      graph3.bulletSize = 5;		
      graph3.title = "Init";
      graph3.valueField = "INIT";
		graph3.lineColor = "#FF9E01";
		graph3.lineThickness = 2;
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
				},
			   OnWelcome: function(levent) {
					var stream = "chartStream";
					var result = jWebSocketClient.registerStream(stream);
					result = jWebSocketClient.resultToString(result);
					log("jWebSocket connection established " + result);
    			},  
				OnMessage: function(levent, token) {
					if(jWebSocketClient.isLoggedIn()) {
						parsePieChartData(levent.data);
						parseLineChartData(levent.data);
					} else {
					}
				},
				OnClose: function(levent) {
					log("jWebSocket connection closed");						
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

