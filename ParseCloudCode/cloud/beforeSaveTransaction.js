//beforeSaveTransaction
exports.func = function (request, response) {

    var params, senderWallet, querySenderWallet, receiverWallet, queryReceiverWallet;
    
    params = {
        senderWallet: request.object.get("senderWallet").id,
        receiverWallet: request.object.get("receiverWallet").id,
        valueInCents: request.object.get("value"),
        senderDescription: request.object.get("senderDescription"),
        receiverDescription: request.object.get("receiverDescription"),
        bitcoinTx: request.object.get("bitcoinTx"),
    };
    
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
                                        
                                    
                                    //TODO: verifica se há uma transacao bitcoin da conta origem para a de destino
                                    //TODO: verifica se a transacao bitcoin esta devidamente assinada
                                    
                                    //if (!isBitcoinTransactionValid(params)) {
                                    //    response.error("Invalid bitcoin transaction");
                                    //    return;                                                                
                                    //}
                                    
                                    Parse.Cloud.useMasterKey();
                                    
                                    //Enforce the redundant social bank pointer
                                    request.object.set("socialBank", senderWallet.get("socialBank"));
                                    
                                    //Update the balances of sender and receiver wallets
                                    senderWallet.set("balance", senderWallet.get("balance") - params.valueInCents);
                                    receiverWallet.set("balance", receiverWallet.get("balance") + params.valueInCents);
                                    
                                    senderWallet.save(null, {
                                        success: function(senderWallet) {
                                            receiverWallet.save(null, {
                                                success: function(receiverWallet) {

                                                    console.log("ponto G");
                                                    //TODO: Broadcast the bitcoin transaction
                                                    //TODO: Send push notifications to the receiver user

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
