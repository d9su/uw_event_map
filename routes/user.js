/**
 * Handle user operations
 */

var crypto = require('crypto');
var db = require('./database');

// Make sure no one is logged in
exports.checkUnlogged = function(req, res, next) {
	if (typeof req.session.username != 'undefined') {
		res.send(403, 'forbidden');
	} else {
		next();
	}
}

// Make sure the user is logged in
exports.authorize = function(req, res, next) {
	if (typeof req.session.username == 'undefined') {
		res.send(401, 'unauthorized');
	} else {
		next();
	}
}

// Populates user session
exports.setSession = function(req, res) {
	req.session.regenerate(function(err){
		req.session.username = req.body.username;
		req.session.email = req.body.email;
		res.send(230, 'ok');
	});
};

// Check if user name is available
exports.checkName = function(req, res) {
	var username = req.body.username;
	var user = new db.User({username: username});
	user.fetch(function(err, result) {
		if (!err) {
			console.log(result);
			if (result.length > 0)
				res.send(200, 'bad');
			else
				res.send(200, 'good');

		} else {
			console.log(err);
			res.send(500, 'serverfault');
		}
	});
};

// Check if email is available
exports.checkEmail = function(req, res) {
	var email = req.body.email;
	var user = new db.User({email: email});
	user.fetch(function(err, result){
		if (!err) {
			console.log(result);
			if (result.length > 0)
				res.send(200, 'bad');
			else
				res.send(200, 'good');

		} else {
			console.log(err);
			res.send(500, 'serverfault');
		}
	});
};

// Signup the user, insert a user record into database
exports.signup = function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	console.log(username+':'+password);

	try {
		var salt = crypto.randomBytes(24);
		crypto.pbkdf2(password, salt, 50, 24, function(e, key){
			if (!e) {
				var hash64 = new Buffer(key).toString('base64');
				var salt64 = new Buffer(salt).toString('base64');
				var now = db.now();
				var user = new db.User({
					username: username, 
					email: email, 
					password: hash64, 
					salt: salt64, 
					registerTime: now,
					recentVisitTime: now
				});

				user.create(function(err, result){
					if (!err) {
						next();
					} else {
						console.log(err);
						res.send(500, 'serverfault');
					}
				});

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

// Make sure user login credential is correct and login
exports.login = function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;

	var user = new db.User({username: username});
	user.fetch(function(err, result) {
		if (!err) {
			if (result.length === 0) {
				res.send(401, 'baduser');
				return;
			}
			
			var hash = result[0].hash;
			var salt2 = new Buffer(result[0].salt, 'base64');

			crypto.pbkdf2(password, salt2, 50, 24, function(e, key){
				if (!e) {
					var result = new Buffer(key).toString('base64');
					if (result === hash) {
						console.log('Password matched');
						req.body.email = result[0].email;
						next();

					} else {
						console.log('Wrong password');
						res.send(401, 'badpsw');
						return;
					}

				} else {
					console.log(e);
					res.send(500, 'serverfault');
					return;
				}
			});
			

		} else {
			console.log(err);
			res.send(500, 'serverfault');
		}
	});
}

// Logout
exports.logout = function(req, res) {
	req.session.username = undefined;
	req.session.email = undefined;
	res.send(200, 'ok');
}