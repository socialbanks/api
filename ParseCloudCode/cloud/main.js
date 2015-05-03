var hello = require('cloud/hello.js');
Parse.Cloud.define("hello", hello.func);

var get_balances = require('cloud/get_balances.js');
Parse.Cloud.define("get_balances", get_balances.func);

var create_issuance = require('cloud/create_issuance.js');
Parse.Cloud.define("create_issuance", create_issuance.func);
