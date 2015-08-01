#!/usr/bin/env node

var https = require('https');
var opt = require('node-getopt').create([
    ['q', 'search_query=ARG', 'search query'],
	['h' , 'help', 'display this help']
])
.bindHelp()
.parseSystem();

var CLIENT_ID = 'kMRaR35PmKwZRqtEfznNkQUaiitKr0Ij';
var CLIENT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ5WVNyOWlncm1Qa1IiLCJpYXQiOjE0MzgyNjY3OTEsImV4cCI6MTQ2OTgwMzA2Miwic3ViIjoicm9vdEBleGFtcGxlLmNvbSIsInJvb3QiOnRydWUsInRva2VuVHlwZSI6IkFDQ0VTUyIsImVtYWlsIjoicm9vdEBleGFtcGxlLmNvbSJ9.308YvI73sQM3IkCu_iIOQ1h55pAW9nZttG2xOVspdwE';
var API_HOST = 'api.smartcanvas.com';

try {
	var q = ''
	if (opt.options.search_query) {
		q = opt.options.search_query;
	}
	searchCard(q);
} catch (err) {
    throw err;
}

function searchCard(q) {
	var options = {
		host: API_HOST,
		path: '/card/v1/cards?q=' + q,
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
			respBody = JSON.parse(body)
			console.log("Card returned: ", respBody);
		});
	}).on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});
	
}