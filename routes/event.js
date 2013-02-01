/**
 * Handle event operations
 */

var db = require('./database');

// Save event into database
exports.saveEvent = function(req, res) {
	var now = db.now();
	var event = new db.Event({
		name: req.body.name,
		type: req.body.type,
		start: req.body.start,
		end: req.body.end,
		desc: req.body.desc,
		tags: req.body.tags,
		user: req.session.username,
		create_time: now
	});

	event.create(function(err, result){
		if (!err) {
			res.send(200, 'ok');
		} else {
			console.log(err);
			res.send(500, 'serverfault');
		}
	});
}