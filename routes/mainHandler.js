/**
 * Main page handler
 */

exports.getIndex = function(req, res){
	res.render('index', { title: 'CompuzZ' });
};

exports.login = function(req, res){
	res.render('login-progress', { title: 'Loging in...'});
}
