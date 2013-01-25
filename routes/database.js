/**
 * Database handler
 */

 // DB Connections
var db = require('mysql');
var c = db.createConnection({
	host:		'localhost',
	database: 	'compuzz',
	user:		'compuzz',
	password:	'goodegg',
});

exports.checkname = function(req, res) {
	var username = c.escape(req.query['name']);
	c.query('SELECT id FROM user WHERE user_name = '+username, 
		function(err, rows, fields){
			if (!err) {
				console.log(rows);
				if (rows.length > 0)
					res.send('hit', 200);
				else
					res.send('available', 200);

			} else {
				console.log(err);
				res.status(500).end();
			}
		});
};

exports.saveCredentials = function(req, res, next) {
	var username = c.escape(req.body.username);
	var password_h = c.escape(req.body.password);	// Hashed password
	var salt = c.escape(req.body.salt);
	
	c.query('INSERT INTO user (`user_name`, `hash`, `salt`, `register_at`, `last_visit_at`) \
				VALUES ('+username+', '+password_h+', '+salt+', NOW(), NOW())',
				function(err, rows, fields){
					if (!err) {
						next();

					} else {
						console.log(err);
						res.status(500).end();
					}
				});
};

exports.checkCredentials = function(req, res, next) {
	var username = c.escape(req.body.username);

	c.query('SELECT hash, salt FROM user WHERE `user_name`='+username, 
		function(err, rows, fields){
			if (!err) {
				if (rows.length === 0)
					res.status(401).end();
				
				req.body.hash = rows[0].hash;
				req.body.salt = rows[0].salt;
				next();

			} else {
				console.log(err);
				res.end();
			}
		});
};

exports.fetchTags = function(req, res) {
	var matchString = c.escape('%' + req.query['match'] + '%');
	c.query('SELECT * FROM event_tag WHERE tag_name LIKE ' + matchString + ' OR tag_desc LIKE ' + matchString + '',
		function(err, rows, fields){
			if (!err) {
				console.log(JSON.stringify(rows));
				res.send(JSON.stringify(rows));

			} else {
				console.log(err);
				res.end();
			}
		}
	);
};

exports.saveEvent = function(req, res) {
	var id = c.escape(req.body.id),
		name = c.escape(req.body.name),
		type = c.escape(req.body.type),
		date = c.escape(req.body.date),
		desc = c.escape(req.body.desc),
		tags = c.escape(req.body.tags);
	console.log(req.body);
	date = 100;

	// Update
	if (parseInt(id) >= 0)	{


	// Create
	} else if (parseInt(id) === -1) {
		var typeQuery = c.query('SELECT id FROM event_type WHERE type_name = ' + type);
		typeQuery.
			on('result', function(row){
				// Found a supported event type
				if (row!={} && row!=null) {
					c.query('INSERT INTO event_info (`name`, `type`, `date`, `desc`) VALUES ('+name+', '+row.id+', '+date+', '+desc+')',
						function(err, rows, fields) {
							if (!err) {
								res.end();
							} else {
								console.log(err);
								res.end();
							}
						}
					);

				// Unsupported event type
				} else {
					res.end();
				}
			}).
			on('error', function(error){
				console.log('error')
				res.end()
			});


	// Unknown method
	} else {

	}


};