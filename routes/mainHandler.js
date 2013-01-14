/**
 * Main page handler
 */

exports.getIndex = function(req, res){
	res.render('index', { title: 'CompuzZ' });
};
