
//beforeSaveTransaction
exports.func = function (request, response) {

    //sign_bitcoin_transaction
    var sign_bitcoin_transaction = function (request, callback) {    

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

                callback(httpResponse.data)
            },
            error: function (httpResponse) {                
                console.log("sign_bitcoin_transaction: ponto 4 - " + httpResponse.text);
                console.log("Trying again...");
                
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

                        callback(httpResponse.data)
                    },
                    error: function (httpResponse) {
                        console.log("sign_bitcoin_transaction: ponto 4 - " + httpResponse.text);
                        callback({
                            Code: httpResponse.status,
                            Message: "Parse.Cloud.httpRequest error: " + httpResponse.text
                        });
                    }
                });
            }
        });
        console.log("momento estranho!");
    };
    
    var params, senderWallet, querySenderWallet, receiverWallet, queryReceiverWallet, senderWIF, btc_trans;
    
    params = {
        senderWallet: request.object.get("senderWallet").id,
        receiverWallet: request.object.get("receiverWallet").id,
        valueInCents: request.object.get("value"),
        senderDescription: request.object.get("senderDescription"),
        receiverDescription: request.object.get("receiverDescription"),
        bitcoinTx: request.object.get("bitcoinTx"),
        receiverAddress: request.object.get("receiverAddress")
    };
    
    console.log("ID = " + request.object.get("objectId"));
    
    //Recover the sender wallet object
    querySenderWallet = new Parse.Query("Wallet");
    querySenderWallet.include("user");
    querySenderWallet.include("socialBank");
    querySenderWallet.equalTo("objectId", params.senderWallet);
    querySenderWallet.find({
        success: function(results) {
            switch (results.length) {
                case 1:
                    senderWallet = results[0]; 
                    
                    //check if the sender wallet is really owned by the logged user
                    if (senderWallet.get("user").id != request.user.id) {
                        response.error("User tried to access another user wallet");
                        return;                        
                    }
                    
                    //check if the sender wallet is really owned by the logged user
                    if (params.valueInCents > senderWallet.get("balance")) {
                        response.error("Wallet don't have sufficient balance to withdraw " + params.valueInCents.toString());
                        return;                        
                    }

                    //TODO: Only for test - this user private information should never leave the mobile wallet
                    senderWIF = senderWallet.get("wif_remove");
                    
                    //Recover the receiver wallet object
                    queryReceiverWallet = new Parse.Query("Wallet");
                    queryReceiverWallet.equalTo("objectId", params.receiverWallet);
                    queryReceiverWallet.find({
                        success: function(results) {
                            switch (results.length) {
                                case 1:
                                    receiverWallet = results[0]; 
                                    
                                    //check if the receiver wallet works with the same social bank (same currency) of the sender
                                    if (senderWallet.get("socialBank").id != receiverWallet.get("socialBank").id) {
                                        response.error("Receiver wallet isn't of the same social bank currency");
                                        return;                                                                
                                    }
                                        
                                    var sign_request = {
                                        params: {
                                            receiverAddr: params.receiverAddress,                                            
                                            valueInSatoshis: params.valueInCents * 1000, //TODO: 1000 should a column in SocialBank
                                            clientWIF: senderWIF
                                        }
                                    }
                                    
                                    console.log("antes de sign_bitcoin_transaction");
                                    btc_trans = sign_bitcoin_transaction(sign_request, function(btc_trans) {
                                        console.log("depois de sign_bitcoin_transaction");

                                        console.log("Ponto 1");

                                        if (btc_trans === undefined) {
                                            console.log("Couldn't broadcast the bitcoin transaction.");
                                            //response.error("Couldn't broadcast the bitcoin transaction.");
                                            //return;
                                        }   
                                        else if (btc_trans.Success === undefined) {
                                            console.log("Couldn't broadcast the bitcoin transaction: " + btc_trans.Message);
                                            //response.error("Couldn't broadcast the bitcoin transaction: " + btc_trans.Message);
                                            //return;                                                                                                        
                                        } else if (btc_trans.Success == false) {
                                            console.log(".NET API server return an error: " + btc_trans.Message);
                                        }

                                        //Convert satoshis to cents (1 btc = 1000 social money = 100.000 cents)
                                        //var feeInCents = Math.floor(btc_trans.FeeValue / 1000);
                                        var feeInCents = 2; //we're working now with constant fees.

                                        Parse.Cloud.useMasterKey();

                                        //Enforce the redundant social bank pointer
                                        request.object.set("socialBank", senderWallet.get("socialBank"));
                                        request.object.set("bitcoinTransfered", false);

                                        
                                        //Update the balances of sender and receiver wallets
                                        senderWallet.set("balance", senderWallet.get("balance") - params.valueInCents - feeInCents);
                                        receiverWallet.set("balance", receiverWallet.get("balance") + params.valueInCents);

                                        senderWallet.save(null, {
                                            success: function(senderWallet) {
                                                receiverWallet.save(null, {
                                                    success: function(receiverWallet) {

                                                        console.log("senderWallet saved");
                                                        
                                                        if ((btc_trans) && (btc_trans.RawTx)) {
                                                            //request.object.set("signedRawTransaction", btc_trans.RawTx);
                                                            console.log(btc_trans.RawTx);
                                                            request.object.set("bitcoinTransfered", true);                                            
                                                        }

                                                        response.success();

                                                    },
                                                    error: function(receiverWallet, error) {
                                                        response.error("WARNING: Inconsistent State! Couldn't save the receiver balance (sender wallet was changed): " + error.message);
                                                        return;                                                                
                                                    }
                                                });                                    
                                            },
                                            error: function(senderWallet, error) {
                                                response.error("Couldn't save the new sender balance: " + error.message);
                                                return;                                                                
                                            }
                                        });                                    
                                        
                                    });

                                    break;
                                case 0:
                                    response.error("Couldn't find a Wallet with id: " + params.receiverWallet);                
                                    return;
                                default:
                                    //TODO: At the beginning we used bitcoinAddress to get wallets, but now this flow doesn't make sense.
                                    response.error("There are more then one Wallet: " + params.receiverWallet);                
                                    return
                            }
                        },
                        error: function() {
                            response.error("Wallet query by id " + params.receiverWallet + " failed");
                            return;
                        }
                    });
                    
                    break;
                case 0:
                    response.error("Couldn't find a Wallet with id: " + params.senderWallet);                
                    return;
                default:
                    response.error("There are more then one Wallet with id: " + params.senderWallet);                
                    return
            }
        },
        error: function() {
            response.error("Wallet query by id " + params.senderWallet + " failed");
            return;
        }
    });
        
}
