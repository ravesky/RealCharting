var jWebSocketClient = null;

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

function registerStream() {
	var stream = "chartStream";
	var result = jWebSocketClient.registerStream(stream);
	result = jWebSocketClient.resultToString(result);
	log("jWebSocket connection established " + result);
}

function log(message) {
	$('#top_message').text(message).slideDown().delay(500).slideUp();
}
	

$(document).ready(function() {
	
	if(jws.browserSupportsWebSockets()) {
  		jWebSocketClient = new jws.jWebSocketJSONClient();
  	} else {
   	var message = jws.MSG_WS_NOT_SUPPORTED;
	 	log(message);
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
						
					} else {
						
					}
				},
				OnClose: function(levent) {
					log("jWebSocket connection closed");
				}
			}); // jWebSocketClient.logon()
		} catch(e) {
			log("Exception: " + e.message );
		}
	}); // $('#connect').click(function()

	
	$('#disconnect').click(function() {
		disconnect();
		pieChart.colors = ["#CCCCCC"];
		pieChart.dataProvider = [{status: "OFFLINE", count: 1}];
		pieChart.validateData();		
	}); // $('#disconnect').click(function() 

}); // $(document).ready(function

$(document).unload(function() {
	jWebSocketClient.stopKeepAlive();
	disconnect();
}); //$(document).unload(function() 	

