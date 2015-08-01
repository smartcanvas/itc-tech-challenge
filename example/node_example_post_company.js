#!/usr/bin/env node

/*
 ********************
 * Example of Card Json *
 ********************
    {"attachments":[],"autoApprove":true,"categories":["techchallenge"],"content":"Test card inserted by nodejs","metaTags":["c2"],"summary":"Test card summary","title":"Test card title.","contentProvider":{"contentId":"testcard","id":"node-example","userId":"node-example-user"}}
 * 
 */
var https = require('https');
var opt = require('node-getopt').create([
    ['c', 'card_json=ARG', 'card json'],
	['h' , 'help', 'display this help']
])
.bindHelp()
.parseSystem();

var CLIENT_ID = 'kMRaR35PmKwZRqtEfznNkQUaiitKr0Ij';
var CLIENT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ5WVNyOWlncm1Qa1IiLCJpYXQiOjE0MzgyNjY3OTEsImV4cCI6MTQ2OTgwMzA2Miwic3ViIjoicm9vdEBleGFtcGxlLmNvbSIsInJvb3QiOnRydWUsInRva2VuVHlwZSI6IkFDQ0VTUyIsImVtYWlsIjoicm9vdEBleGFtcGxlLmNvbSJ9.308YvI73sQM3IkCu_iIOQ1h55pAW9nZttG2xOVspdwE';
var API_HOST = 'api.smartcanvas.com';

var CARD_JSON = opt.options.card_json;
if (!CARD_JSON) {
    process.stderr.write("card json (-c) parameter is required.\n");
    process.exit(1);
}
try {
	createCard(CARD_JSON);
} catch (err) {
    throw err;
}

function createCard(card) {
	var options = {
		host: API_HOST,
		path: '/card/v1/cards',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(card),
			'x-client-id': CLIENT_ID,
			'x-access-token': CLIENT_TOKEN
		}
	}
	var req = https.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			console.log('Card created: ' + chunk);
		});
	});
	req.on('error', function(e) {
	console.log('problem with request: ' + e.message);
	});
	req.write(card);
	req.end();
	
}