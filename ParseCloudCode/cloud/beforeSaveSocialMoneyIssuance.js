//beforeSaveSocialMoneyIssuance
exports.func = function (request, response) {

    var params, reject;
    
    params = {
        socialBankId: request.object.get("socialBank").id,
        value: request.object.get("value"),
        bankOfficerUserId: request.object.get("bankOfficerUser").id,
        bitcoinTx: request.object.get("bitcoinTx"),
    };
    
    //Helper to reject promises
    reject = function(message) {
        var failed = new Parse.Promise();
        failed.reject(message);
        return failed;
    }

    //Recover the sender wallet object
    querySocialBank = new Parse.Query("SocialBank");
    querySocialBank.get(params.socialBankId)
    .then(function(socialBank) { 
        
        //check if the value is greater then zero    
        if (params.value <= 0) {
            return reject("Invalid issuance value: " + params.value.toString());
        }
        
        //check if the value is greater then 100,000.00    
        if (params.value > 10000000) {
            return reject("Issuance value exceded the limit of 10000000: " + params.value.toString());
        }
        
        //TODO: Check if the current user is an bankOfficer of this SocialBank
        
        //Enforce the user responsible for the issuance
        request.object.set("bankOfficerUser", request.user);

        //Enforce the issuance bitcoin address
        request.object.set("issuanceBitcoinAddress", socialBank.get("bitcoinAddressForSocialMoneyIssuance"));
        
        //TODO: validate the bitcoin transaction (check the bitcoinAddressForSocialMoneyIssuance, signature, etc.)     
        //TODO: co-sign the issuance bitcoin transaction and update the bitcoinTx field
        
        //update the social money balances in SocialBank
        socialBank.set("totalIssuedSocialMoney", socialBank.get("totalIssuedSocialMoney") + params.value);
        socialBank.set("totalActiveSocialMoney", socialBank.get("totalActiveSocialMoney") + params.value);
        socialBank.set("onlineSocialMoneyBalance", socialBank.get("onlineSocialMoneyBalance") + params.value);

        return socialBank.save(null);        
        
    }).then(function(socialBank) {        
        
        //TODO: broadcast SocialMoneyIssuance.bitcoinTx

        response.success();
        
    }, function(error) {
        response.error(error);
    });

}
