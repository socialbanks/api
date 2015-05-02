Parse.Cloud.define("hello", function (request, response) {
                   response.success("Hello world!");
                   });


Parse.Cloud.define("get_balances", function (request, response) {
                   
                   Parse.Cloud.httpRequest({
                                           method: 'POST',
                                           url: 'http://counterparty:1234@xcp-dev.vennd.io:4000/api/',
                                           body:
                                           {
                                           "jsonrpc": "2.0",
                                           "id": 0,
                                           "method": "get_balances",
                                           "params": {
                                           "filters": {
                                           "field": "address",
                                           "op": "IN",
                                           "value": [
                                                     "1Ko36AjTKYh6EzToLU737Bs2pxCsGReApK",
                                                     "1BdHqBSfUqv77XtBSeofH6XwHHczZxKRUF",
                                                     "1sEAUJsjuYJ9P64Y2MxchwyDfw8hbQDNA"
                                                     ]
                                           }
                                           }
                                           },
                                           
                                           headers: {
                                           'Content-Type': 'application/json;charset=utf-8',
                                           'Accept': 'application/json, text/javascript'
                                           },
                                           success: function (httpResponse) {
                                           response.success(httpResponse.data);
                                           },
                                           error: function (httpResponse) {
                                           response.success(
                                                            "Request failed with response code " +
                                                            httpResponse.status +
                                                            "\n" +
                                                            httpResponse.text
                                                            );
                                           }
                                           });
                   
                   });
