//get_unspent
exports.func = function (request, response) {    
    var sUrl = "https://blockchain.info/pt/unspent?active=" + request.params.addr;
    
    Parse.Cloud.httpRequest({
        method: 'GET',
        url: sUrl,
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
