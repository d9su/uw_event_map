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
}

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


}