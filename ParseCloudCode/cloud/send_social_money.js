var InvokeMethodCounterparty = require('cloud/InvokeMethodCounterparty.js');

exports.func = function (request, response) {
    
    var params, senderWallet, querySenderWallet, receiverWallet, queryReceiverWallet;
    
    params = {
        //asset: request.params.asset,
        senderAddress: request.params.senderAddress,
        receiverAddress: request.params.receiverAddress,
        valueInCents: request.params.valueInCents,
        description: request.params.description,
        //txId: request.params.txId,
        signedRawTransaction: request.params.signedRawTransaction,
    };
            
    //Recover the sender wallet object
    querySenderWallet = new Parse.Query("Wallet");
    querySenderWallet.include("user");
    querySenderWallet.include("socialBank");
    querySenderWallet.equalTo("bitcoinAddress", params.senderAddress);
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
                    if (params.valueInCents > (100*senderWallet.get("balance"))) {
                        response.error("Wallet don't have sufficient balance to withdraw " + params.value.toString());
                        return;                        
                    }

                    //Recover the receiver wallet object
                    queryReceiverWallet = new Parse.Query("Wallet");
                    queryReceiverWallet.equalTo("bitcoinAddress", params.receiverAddress);
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
                                                                        
                                    //Record the new transaction
                                    var Transaction = Parse.Object.extend("Transaction");
                                    var trans = new Transaction();

                                    trans.set("value", params.valueInCents);
                                    trans.set("socialBank", senderWallet.get("socialBank"));
                                    trans.set("senderDescription", params.description);
                                    trans.set("receiverDescription", "Received from ?????");
                                    trans.set("senderWallet", senderWallet);
                                    trans.set("receiverWallet", receiverWallet);
                                    trans.set("bitcoinTx", params.signedRawTransaction);

                                    trans.save(null, {
                                        success: function(trans) {
                                            //trans.id ....
                                        },
                                        error: function(trans, error) {
                                            response.error("Couldn't save the transaction: " + error.message);
                                            return;                                                                
                                        }
                                    });                                    
                                    
                                    
                                    //Update the balances of sender and receiver wallets
                                    senderWallet.set("balance", senderWallet.get("balance") - params.valueInCents);
                                    receiverWallet.set("balance", receiverWallet.get("balance") + params.valueInCents);
                                    
                                    senderWallet.save(null, {
                                        success: function(senderWallet) {
                                            receiverWallet.save(null, {
                                                success: function(receiverWallet) {

                                                    //TODO: Broadcast the bitcoin transaction
                                                    //TODO: Send push notifications to the receiver user

                                                    //Returns true to the sender. The mobile app should refresh balance and history to reflect the new transaction
                                                    var result = { Result: Boolean };
                                                    result.Result = true;    
                                                    response.success(JSON.stringify(result));                                                
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
                                    response.error("Couldn't find a Wallet with bitcoinAddress: " + params.receiverAddress);                
                                    return;
                                default:
                                    response.error("There are more then one Wallet with bitcoinAddress: " + params.receiverAddress);                
                                    return
                            }
                        },
                        error: function() {
                            response.error("Wallet query by address " + params.receiverAddress + " failed");
                            return;
                        }
                    });
                    
                    break;
                case 0:
                    response.error("Couldn't find a Wallet with bitcoinAddress: " + params.senderAddress);                
                    return;
                default:
                    response.error("There are more then one Wallet with bitcoinAddress: " + params.senderAddress);                
                    return
            }
        },
        error: function() {
            response.error("Wallet query by address " + params.senderAddress + " failed");
            return;
        }
    });
    
}

