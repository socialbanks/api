var InvokeMethodCounterparty = require('cloud/InvokeMethodCounterparty.js');

exports.func = function (request, response) {
	InvokeMethodCounterparty.func(
		request, 
		response, 
		"create_issuance",
		{
			"source"                     : request.params.source, 
			"asset"                      : request.params.asset, 
			"quantity"                   : request.params.quantity,
            "divisible"                  : true,
			"description"                : request.params.description,
            "encoding"                   : "pubkeyhash",
			"pubkey"                     : request.params.pubkey,             
            "allow_unconfirmed_inputs"   : true
		}
	);
}

