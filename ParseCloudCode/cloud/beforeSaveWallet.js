//beforeSaveWallet
exports.func = function (request, response) {
    var params;
    
    params = {
        balance: request.object.get("balance"),
    };

    if (request.object.isNew()) {
        if (params.balance > 0) {
            response.error("Can't create a wallet with non-zero balance");
            return;                        
        }

        //Only for test (while the mobile app is generaring a invalid address)
        request.object.set("user", request.user);
        request.object.set("correct_bitcoinAddress", "3JuD1pvmMBfUSehekfGMvnYrsUtgybvqvz")
        request.object.set("wif_remove", "L11S7b46MygEKiMFH8jdHJHLv1TPGS7x4i6wtZRdGWbfhK87Q9wi")
        
     }
    response.success();
}
    
