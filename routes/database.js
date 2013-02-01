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

// Transform JS date into mysql datetime format
exports.now = function(){
	var date = new Date();
	var date = date.getUTCFullYear() + '-' + ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' + date.getUTCDate() + ' ' + ('00' + date.getUTCHours()).slice(-2) + ':' + ('00' + date.getUTCMinutes()).slice(-2) + ':' + ('00' + date.getUTCSeconds()).slice(-2);
	return date;
}

// Objects representing db model
exports.User = function(properties) {
	// Private vars
	var data = {
		id: properties.id,
		user_name: properties.username,
		email: properties.email,
		hash: properties.password,
		salt: properties.salt,
		register_at: properties.registerTime,
		last_visit_at: properties.recentVisitTime
	};

	this.getName = function() { return data.user_name; };
	this.getEmail = function() { return data.email; };
	this.getHash = function() { return data.hash; };
	this.getSalt = function() { return data.salt; };
	this.getRegTime = function() { return data.register_at; };

	// resource ops
	this.create = function(callback) {
		c.query('INSERT INTO user SET ?', data, function(err, result) { callback(err, result); });
	};

	this.fetch = function(callback) {
		var condition = '';
		Object.keys(data).forEach(function(key) {
			if (data[key] != null) {
				condition += key + '=' + c.escape(data[key]) +' AND ';
			}
		});
		condition = condition.slice(0, condition.length-4);
		console.log(condition);
		c.query('SELECT * FROM user WHERE ' + condition, function(err, result){ callback(err, result); });
	}

};

exports.Event = function(properties) {
	// Private vars
	var data = {
		name: properties.name,
		type: properties.type,
		start: properties.start,
		end: properties.end,
		desc: properties.desc,
		created_by: properties.user,
		created_at: properties.create_time
	};

	this.create = function(callback) {
		var typeQuery = c.query('SELECT id FROM event_type WHERE type_name = ' + c.escape(data.type));
		typeQuery.
			on('result', function(row){
				// Found a supported event type
				if (row!={} && row!=null) {
					data.type = row.id;
					console.log(data);
					c.query('INSERT INTO event_info SET ?', data, function(err, result) { callback(err, result); });

				// Unsupported event type
				} else {
					callback('unsupported event type');
				}
			}).
			on('error', function(error){
				callback(error);
			});
	}

}


exports.insert = function(table, model, callback) {
	var tableName = c.escape(table);
	c.query('INSERT INTO ' + tableName + ' SET ?', model.data, callback(err, result));
};

exports.select = function(table, query, constraints, callback) {
	var tableName = c.escape(table);
	c.query('SELECT ? FROM ' + tableName + ' WHERE ? ', query, constraints, callback(err, result));
};

exports.saveCredentials = function(req, res, next) {
	var username = c.escape(req.body.username);
	var email = c.escape(req.body.email);
	var password_h = c.escape(req.body.password);	// Hashed password
	var salt = c.escape(req.body.salt);
	
	c.query('INSERT INTO user (`user_name`, `email`, `hash`, `salt`, `register_at`, `last_visit_at`) \
				VALUES ('+username+', '+email+', '+password_h+', '+salt+', NOW(), NOW())',
				function(err, rows, fields){
					if (!err) {
						next();

					} else {
						console.log(err);
						res.send('serverfault');
						res.send(500);
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
				res.send(500, 'serverfault');
			}
		}
	);
};

exports.getEvents = function(req, res) {

};

exports.createEvent = function(req, res) {
	var id = c.escape(req.body.id),
		name = c.escape(req.body.name),
		type = c.escape(req.body.type),
		date = c.escape(req.body.date),
		desc = c.escape(req.body.desc),
		tags = c.escape(req.body.tags);
	console.log(req.body);
	date = 100;

	var typeQuery = c.query('SELECT id FROM event_type WHERE type_name = ' + type);
	typeQuery.
		on('result', function(row){
			// Found a supported event type
			if (row!={} && row!=null) {
				c.query('INSERT INTO event_info (`name`, `type`, `date`, `desc`) VALUES ('+name+', '+row.id+', '+date+', '+desc+')',
					function(err, rows, fields) {
						if (!err) {
							res.send(200, 'ok');
						} else {
							console.log(err);
							res.send(500, 'serverfault');
						}
					}
				);

			// Unsupported event type
			} else {
				res.send(403, 'badtype');
			}
		}).
		on('error', function(error){
			console.log(error);
			res.send(500, 'serverfault');
		});
};

exports.updateEvent = function(req, res){

};

exports.deleteEvent = function(req, res){

};