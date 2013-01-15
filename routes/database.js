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
			}
		}
	);
}