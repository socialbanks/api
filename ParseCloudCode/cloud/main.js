//yay
var hello = require('cloud/hello.js');
Parse.Cloud.define("hello", hello.func);

var get_balances = require('cloud/get_balances.js');
Parse.Cloud.define("get_balances", get_balances.func);

var get_credits = require('cloud/get_credits.js');
Parse.Cloud.define("get_credits", get_credits.func);

var get_debits = require('cloud/get_debits.js');
Parse.Cloud.define("get_debits", get_debits.func);


var create_issuance = require('cloud/create_issuance.js');
Parse.Cloud.define("create_issuance", create_issuance.func);

var f = require('cloud/send.js');
Parse.Cloud.define("send", f.func);

var create_wallet = require('cloud/create_wallet.js');
Parse.Cloud.define("create_wallet", create_wallet.func);

var send_social_money = require('cloud/send_social_money.js');
Parse.Cloud.define("send_social_money", send_social_money.func);

