/**
 * Handle user operations
 */

var crypto = require('crypto');

exports.checkUnlogged = function(req, res, next) {
	if (typeof req.session.username != 'undefined') {
		res.send(403, 'forbidden');
	} else {
		next();
	}
}

exports.authorize = function(req, res, next) {
	if (typeof req.session.username == 'undefined') {
		res.send(401, 'unauthorized');
	} else {
		next();
	}
}

exports.setSession = function(req, res) {
	req.session.username = req.body.username;
	req.session.email = req.body.email;
	res.send(230, 'ok');
};

exports.signup = function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	console.log(username+':'+password);

	try {
		var salt = crypto.randomBytes(24);
		crypto.pbkdf2(password, salt, 50, 24, function(e, key){
			if (!e) {
				// Prepare data for database storage
				req.body.password = new Buffer(key).toString('base64');
				req.body.salt = new Buffer(salt).toString('base64');
				console.log(req.body.password);;
				console.log(req.body.salt);
				next();

			} else {
				console.log(e);
				res.send(500, 'serverfault');
			}

		});

	} catch (e) {
		console.log(e);
		res.send(500, 'serverfault');
	}
};

exports.login = function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	var hash = req.body.hash;
	var salt = new Buffer(req.body.salt, 'base64');
	console.log(username+':'+password);
	console.log(salt);

	crypto.pbkdf2(password, salt, 50, 24, function(e, key){
		if (!e) {
			var result = new Buffer(key).toString('base64');
			console.log(result);
			if (result === hash) {
				console.log('Password matched');
				next();

			} else {
				console.log('Wrong password');
				res.send(401, 'badpsw');
			}

		} else {
			console.log(e);
			res.send(500, 'serverfault');
		}
	});
}