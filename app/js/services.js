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
                    if (!card.contentProvider) {
                        var d = new Date();
                        var n = d.getTime();
                        card.contentProvider = {
                            'contentId' : n,
                            'id' : 'angular-web-app',
                            'userId' : 'angular-web-app-user'
                        };
                    }
                    card.categories = ['angular-client', 'smes', 'us-en'];
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
                    //card.jsonExtendedData = angular.toJson(company, false);
					card.jsonExtendedData = company;
                    var template = $templateCache.get('cardContentTemplate.html');
                    if (template) {
                        card.content = Mustache.to_html(template, company);
                    }
                },
                fromCard : function (card) {
                    var company = {};
                    company.cardId = card.id;
                    company.name = card.title;
                    company.businessDescription = card.summary;					
                    if (card.attachments && card.attachments[0].images) {
                        company.logoImgUrl = card.attachments[0].images[0].url;						
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
