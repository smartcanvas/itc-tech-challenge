'use strict';

/* Services */

techChallenge.factory('Company', ['$templateCache', '$log',
        function ($templateCache, $log) {
            return {
                toCard : function (company, card) {
                    card.title = company.name;
					card.summary = company.businessDescription;
                    card.mnemonic = company.mnemonic;
                    card.autoApprove = true;
                    card.metaTags = [];
                    card.metaTags[0] = 'c2';
                    var d = new Date();
					card.contentProvider = {
						'contentId' : d.getTime(),
						'id' : 'angular-web-app',
						'userId' : 'angular-web-app-user'
					};
					if (card.categories) {
						card.categories.push('angular-client', 'smes', 'us-en');
					} else {
						card.categories = ['angular-client', 'smes', 'us-en'];
					}
                    if (company.logoImgUrl) {
                        card.attachments = [{
                                'type' : 'photo',
                                'contentURL' : company.logoImgUrl,
                                'images' : []
                            }
                        ];
                        card.attachments[0].images = [{
                                'originalURL' : company.logoImgUrl
                            }
                        ];
                    }
                    card.jsonExtendedData = company;
                    var template = $templateCache.get('cardContentTemplate.html');
                    if (template) {
                        card.content = Mustache.to_html(template, company);
                    }
					
                },
                fromCard : function (response) {  
					var company = response.jsonExtendedData;
                    company.cardId = response.id;
                    if (response.attachments && response.attachments[0].images) {
                        company.logoImgUrl = response.attachments[0].images[0].url;						
                    }
					return company;
                }
            }
        }
    ]);

techChallenge.factory('Card', ['$resource',
        function ($resource) {
            var clientId = '9OgaKkFSNKD2';
            var clientSecret = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI5T2dhS2tGU05LRDIiLCJleHAiOjE0NDgzNzgwNDYsImp0aSI6InFuczNHMlFsM3duUlJjVzRMNlo3dHciLCJpYXQiOjE0MzgwMTAwNDYsInN1YiI6InJvb3RAOU9nYUtrRlNOS0Qyc21hcnRjYW52YXMuY29tIiwiZW1haWwiOiJyb290QDlPZ2FLa0ZTTktEMnNtYXJ0Y2FudmFzLmNvbSIsInRva2VuVHlwZSI6IkFDQ0VTUyIsInJvb3QiOnRydWV9.tM31-Z0y-UizM12sp5i2F5yEuEVp6mBqH_4yDjeZqUE';
            return $resource('https://api.smartcanvas.com/card/v1/cards/:cardId', {
                cardId : '@id'
            }, {
                get : {
                    method : 'GET',
                    headers : {
                        'x-client-id' : clientId,
                        'x-access-token' : clientSecret
                    }
                },
                query : {
                    method : 'GET',
                    headers : {
                        'x-client-id' : clientId,
                        'x-access-token' : clientSecret
                    }
                },
                create : {
                    method : 'POST',
                    headers : {
                        'x-client-id' : clientId,
                        'x-access-token' : clientSecret
                    }
                },
                update : {
                    method : 'PUT',
                    headers : {
                        'x-client-id' : clientId,
                        'x-access-token' : clientSecret
                    },
					transformRequest: function(data) {
						if (data) {
							data.author = undefined;
							data.permission = undefined;
							data = angular.toJson(data);
						}
						return data;
					}
                }
            });
        }
    ]);

techChallenge.factory('Utils', ['$cookies',
        function ($cookies) {
            return {
                storeClientCookies : function (params) {
                    if (params.clientId) {
                        $cookies.put('sc_cid', params.clientId, []);
                    }
                    if (params.clientToken) {
                        $cookies.put('sc_ctk', params.clientToken, []);
                    }
                }
            }
        }
    ]);
