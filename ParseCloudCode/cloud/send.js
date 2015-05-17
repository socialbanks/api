var InvokeMethodCounterparty = require('cloud/InvokeMethodCounterparty.js');

exports.func = function (request, response) {
    
    console.log("func send");
    console.log(request.params.quantity.toString());
	
    InvokeMethodCounterparty.func(
		request, 
		response, 
		"create_send",
		{
			"source"                     : request.params.source, 
			"destination"                : request.params.destination,
			"quantity"                   : request.params.quantity, 
			"asset"                      : request.params.asset, 
			"pubkey"                     : request.params.pubkey, 
            "allow_unconfirmed_inputs"   : true,
            "fee"                        : 0,
            "encoding"                   : "pubkeyhash"
            
		}
	);
}

