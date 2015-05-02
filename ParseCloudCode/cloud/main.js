Parse.Cloud.define("hello", function (request, response) {
    response.success("Hello world!");
});


Parse.Cloud.define("get_balances", function (request, response) {

	var method = "get_balances";
	
	if (request.params.cause_error)
	{
		method = "unexistent_method";
	}
	
    Parse.Cloud.httpRequest({
        method: 'POST',
        url: 'http://counterparty:1234@xcp-dev.vennd.io:4000/api/',
        body:
          {
              "jsonrpc": "2.0",
              "id": 0,
              "method": method,
              "params": {
                  "filters": {
                      "field": "address",
                      "op": "IN",
                      "value": request.params.address
                  }
              }
          },

        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Accept': 'application/json, text/javascript'
        },
        success: function (httpResponse) {
            response.success(httpResponse.data);
        },
        error: function (httpResponse) {
            response.success(
                "Request failed with response code " +
                httpResponse.status +
                "\n" +
                httpResponse.text
                );
        }
    });

});
