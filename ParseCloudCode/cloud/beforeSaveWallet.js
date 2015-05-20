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

        request.object.set("user", request.user);
        
     }
    response.success();
}
    
