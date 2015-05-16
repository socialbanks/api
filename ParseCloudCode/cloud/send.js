var InvokeMethodCounterparty = require('cloud/InvokeMethodCounterparty.js');

exports.func = function (request, response) {
	InvokeMethodCounterparty.func(
		request, 
		response, 
		"send",
		{
			"source"         : request.params.source, 
			"asset"          : request.params.asset, 
			"quantity"       : request.params.quantity, 
			"destination"    : request.params.destination,
            "fee"            : 0      
		}
	);
}

