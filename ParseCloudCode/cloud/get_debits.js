var InvokeMethodCounterparty = require('cloud/InvokeMethodCounterparty.js');

exports.func = function (request, response) {
	InvokeMethodCounterparty.func(
		request, 
		response, 
		"get_debits",
		{
			"filters": 
			{
				"field": "address",
				"op": "IN",
				"value": request.params.address
			}
		}
	);
}

