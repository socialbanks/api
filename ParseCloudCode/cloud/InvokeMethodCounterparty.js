exports.func = function (request, response, method, params) {
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
              "params": params             
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
				{
					error: 
					{
						code: httpResponse.status,
						message: httpResponse.text
					}
				}
                );
        }
    });
}
