//sign_bitcoin_transaction
exports.func = function (request, response) {    

    console.log("chamou a sign_bitcoin_transaction");
   
    var params, parseObjTransaction;
    
    params = {
        receiverAddr: request.params.receiverAddr,
        valueInSatoshis: request.params.valueInSatoshis,
        clientWIF: request.params.clientWIF,
    };
    
    console.log("sign_bitcoin_transaction: ponto 1");
    
    //Fake data for test
    params.receiverAddr = "1FTuKcjGUrMWatFyt8i1RbmRzkY2V9TDMG";
    params.valueInSatoshis = "10000";
    params.clientWIF = "KxyACdWtFEY6p2nAbSAZv9NXgmJNm4i6HDUjgoy1YtVFTskV75KX";
    
    console.log("sign_bitcoin_transaction: ponto 2");

    Parse.Cloud.httpRequest({
        method: 'POST',
        url: "http://www.socialbanks.org/home/create_and_sign_transaction",
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Accept': 'application/json, text/javascript'
        },
        body: params,

        success: function (httpResponse) {
            console.log("sign_bitcoin_transaction: ponto 3");
            console.log(httpResponse.data);

            response.success(httpResponse.data);
        },
        error: function (httpResponse) {
            
            console.log("sign_bitcoin_transaction: ponto 4");
            console.log(httpResponse.text);
  
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
