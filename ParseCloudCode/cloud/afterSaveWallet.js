//afterSaveWallet
exports.func = function (request, response) {
    
    if (request.object.isNew()) {
        var user = Parse.User.current();

        Parse.Cloud.useMasterKey();  
        
        //TODO: (BUG) - This addition doesn't work        
        user.relation("wallet").add(request.object);
        
        user.save().then(function(value) {
            //success
            
        }, function(error) {
            //error
            response.error("afterSaveWallet: Can't save the User (relation to wallet)");
        });
     }

    response.success();
}
    
