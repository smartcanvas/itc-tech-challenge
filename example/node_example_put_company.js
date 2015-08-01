#!/usr/bin/env node

/*
 ********************
 * Example of Card Json *
 ********************
    {"content":"Test card updated by nodejs","metaTags":["c2"],"summary":"Test card summary updated","title":"Test card title"}
 * 
 */
var https = require('https');
var opt = require('node-getopt').create([
	['i', 'card_id=ARG', 'card id'],
    ['c', 'card_json=ARG', 'card json'],
	['h' , 'help', 'display this help']
])
.bindHelp()
.parseSystem();

var CLIENT_ID = 'kMRaR35PmKwZRqtEfznNkQUaiitKr0Ij';
var CLIENT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ5WVNyOWlncm1Qa1IiLCJpYXQiOjE0MzgyNjY3OTEsImV4cCI6MTQ2OTgwMzA2Miwic3ViIjoicm9vdEBleGFtcGxlLmNvbSIsInJvb3QiOnRydWUsInRva2VuVHlwZSI6IkFDQ0VTUyIsImVtYWlsIjoicm9vdEBleGFtcGxlLmNvbSJ9.308YvI73sQM3IkCu_iIOQ1h55pAW9nZttG2xOVspdwE';
var API_HOST = 'api.smartcanvas.com';

var CARD_ID = opt.options.card_id;
if (!CARD_ID) {
    process.stderr.write("card id (-i) parameter is required.\n");
    process.exit(1);
}
try {
	var cardId = parseInt(CARD_ID);
	updateCard(cardId);
} catch (err) {
    throw err;
}

function updateCard(cardId) {
	var card;
	var options = {
		host: API_HOST,
		path: '/card/v1/cards/' + cardId,
		method: 'GET',
		agent: false,
		headers: {
			'x-client-id': CLIENT_ID,
			'x-access-token': CLIENT_TOKEN
		}
	}
	var req = https.get(options, function(res) {
		body = '';
		res.on('data', function(chunk) {
			body += chunk;
		});
		res.on('end', function() {
			card = JSON.parse(body)
			console.log("Card returned: ", card);
			modifyCard(card);
		});
	}).on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});
	return card;
}

function modifyCard(card) {
	// Make some changes to card
	card.title = 'Card title updated at ' + new Date().getTime();
	card.permission = undefined;
	card.contentProvider.updateDate = new Date();
	var body = JSON.stringify(card);
	var options = {
		host: API_HOST,
		path: '/card/v1/cards/' + cardId,
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(body),
			'x-client-id': CLIENT_ID,
			'x-access-token': CLIENT_TOKEN
		}
	}
	var req = https.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			console.log('Card updated: ' + chunk);
		});
	});
	req.on('error', function(e) {
	console.log('problem with request: ' + e.message);
	});
	req.write(body);
	req.end();
	
}