/**
 * Handle user operations
 */

var crypto = require('crypto');

exports.setSession = function(req, res) {
	req.session.username = req.body.username;
	res.status(200).send('success');
};

exports.signup = function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	console.log(username+':'+password);

	try {
		var salt = crypto.randomBytes(24);
		console.log(salt);
		crypto.pbkdf2(password, salt, 50, 24, function(e, key){
			if (!e) {
				// Prepare data for database storage
				req.body.password = new Buffer(key).toString('base64');
				req.body.salt = new Buffer(salt).toString('base64');
				next();

			} else {
				console.log(e);
				res.status(500).end();
			}

		});

	} catch (e) {
		console.log(e);
		res.status(500).end();
	}
};

exports.login = function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	var hash = req.body.hash;
	var salt = req.body.salt.toString('binary');
	console.log(username+':'+password);
	console.log(salt);

	crypto.pbkdf2(password, salt, 50, 24, function(e, key){
		if (!e) {
			var result = new Buffer(key).toString('base64');
			if (result === hash) {
				console.log('Password matched');
				next();

			} else {
				console.log('Wrong password');
				res.status(401).send('bad password');
			}

		} else {
			console.log(e);
			res.status(500).end();
		}
	});
}