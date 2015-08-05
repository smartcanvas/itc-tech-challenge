'use strict';

/* Services */

techChallenge.factory('Company', ['$templateCache', '$log',
        function ($templateCache, $log) {
            return {
                toCard : function (company, card) {
                    card.title = company.name;
					card.summary = company.businessDescription;
                    card.mnemonic = company.mnemonic;
                    card.autoApprove = false;
                    card.metaTags = [];
                    card.metaTags[0] = 'c2';
                    var d = new Date();
					card.contentProvider = {
						'contentId' : d.getTime(),
						'id' : 'angular-web-app',
						'userId' : 'angular-web-app-user'
					};
					var defaultCategories = ['angular-client', 'wbe']
					if (card.categories) {
						for	(var i = 0; i < defaultCategories.length; i++) {
							if (card.categories.indexOf(defaultCategories[i]) < 0) {
								card.categories.push(defaultCategories[i]);
							}
						}						
					} else {
						card.categories = defaultCategories;
					}
					var defaultBkgImg = 'https://storage.googleapis.com/wvef/background-image.png';
                    if (company.logoImgUrl) {
                        card.attachments = [{
                                'type' : 'photo',
                                'contentURL' : company.logoImgUrl,
                                'images' : []
                            },
							{
                                'type' : 'photo',
                                'contentURL' : defaultBkgImg,
                                'images' : []
                            }
                        ];
                        card.attachments[0].images = [{
                                'originalURL' : company.logoImgUrl
                            }
                        ];
						card.attachments[1].images = [{
                                'originalURL' : defaultBkgImg
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
			var apiHost = 'https://api.smartcanvas.com/card/v1/cards/:cardId';
			var clientId = 'kMRaR35PmKwZRqtEfznNkQUaiitKr0Ij';
            var clientSecret = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ5WVNyOWlncm1Qa1IiLCJpYXQiOjE0MzgyNjY3OTEsImV4cCI6MTQ2OTgwMzA2Miwic3ViIjoicm9vdEBleGFtcGxlLmNvbSIsInJvb3QiOnRydWUsInRva2VuVHlwZSI6IkFDQ0VTUyIsImVtYWlsIjoicm9vdEBleGFtcGxlLmNvbSJ9.308YvI73sQM3IkCu_iIOQ1h55pAW9nZttG2xOVspdwE';
			
            return $resource(apiHost, {
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
