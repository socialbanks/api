var InvokeMethodCounterparty = require('cloud/InvokeMethodCounterparty.js');

exports.func = function (request, response) {
    
    var asset = request.params.asset;
    var senderAddress = request.params.senderAddress;
    var receiverAddress = request.params.receiverAddress;
    var value = request.params.value;
    var description = request.params.description;
    var txId = request.params.txId;
    var signedRawTransaction = request.params.signedRawTransaction;
        
    
    //TODO: verificar se a conta de origem é do usuario corrente    
    //TODO: verificar se a conta de origem tem saldo suficiente    
    //TODO: verifica se a conta de destino existe e é da mesma moeda
    //TODO: verifica se há uma transacao bitcoin da conta origem para a de destino
    //TODO: verifica se a transacao bitcoin esta devidamente assinada
    
    //TODO: Registra a transacao
    //TODO: Decrementa o saldo da conta de origem
    //TODO: Incrementa o saldo da conta de destino
    
    //TODO: Envia a transacao bitcoin para a blockchain
    //TODO: Envia notificacao push para o usuario dono da conta de destino
    
    //Returns true to the sender. The mobile app should refresh balance and history to reflect the new transaction
    var result = { Result: Boolean };
    result.Result = true;    
    response.success(JSON.stringify(result));
}

