var Kinvey = require('kinvey');

Kinvey.init({
	'appKey': 'kid_TTUcy8JoKM',
	'masterSecret': '01cdf8232a30453e84b0d38adec76133'
});

var user = new Kinvey.User();

// // Test Kinvey connection
Kinvey.ping({
	success: function(response) {
		console.log('Kinvey Ping Success. Kinvey Service is alive, version: ' + response.version + ', response: ' + response.kinvey);
	},
	error: function(error) {
		console.log('Kinvey Ping Failed. Response: ' + error.description);
	}
});

exports.login = function(req, res) {
	console.log("username: " + req.session);
	if (typeof(req.session.username) == 'undefined') {
		Kinvey.OAuth.requestToken('facebook', {
			redirect: 'http://localhost:3000/oauth',
			success: function(tokens) {
				console.log(tokens);
				res.status(200).send(JSON.stringify({flag: 'success', url: tokens.url}));
			},
			error: function(e) {
				console.log(e);
				res.status(500).send(JSON.stringify({flag: 'error', msg: 'WTF?'}));
			}
		});

	} else {
		res.status(403).send(JSON.stringify({flag: 'error', msg: 'You have already logged in!'}));
	}
};

exports.grantAccessToken = function(req, res) {
	Kinvey.OAuth.accessToken('facebook', req.query, {
		success: function(tokens) {
			user.loginWithFacebook(tokens, {}, {
				success: function(user){
					console.log('Logged in');
					req.session.username = user.getIdentity().facebook.name;
					res.status(200).send('Logged in successful');
				},
				error: function(e){
					console.log(e);
					res.status(500).send(e);
				}
			})
		},
		error: function(e) {

		}
	});
};