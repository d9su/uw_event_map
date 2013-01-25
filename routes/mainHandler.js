/**
 * Main handler for delivering contents
 */

exports.getIndex = function(req, res) {
	res.render('index', { title: 'CompuzZ' });
};

exports.getPartial = function(req, res) {
	var filename = req.params.name;
	res.render('partials/' + filename, { layout: false });
};