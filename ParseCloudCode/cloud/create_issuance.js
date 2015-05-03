var InvokeMethodCounterparty = require('cloud/InvokeMethodCounterparty.js');

exports.func = function (request, response) {
	InvokeMethodCounterparty.func(
		request, 
		response, 
		"create_issuance",
		{
			"source"      : request.params.source, 
			"asset"       : request.params.asset, 
			"quantity"    : request.params.quantity, 
			"description" : request.params.description
		}
	);
}

