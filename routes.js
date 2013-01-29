/**
 * Route handlers
 */
var mainHandler = require('./routes/mainHandler');
var user = require('./routes/user');
var database = require('./routes/database')

/**
 * Routes
 */
 module.exports = function(app) {

 	// Home page
	app.get('/', mainHandler.getIndex);

	// Forms
	app.get('/partials/:name', mainHandler.getPartial)

	// Fetch tags
	app.get('/tags', database.fetchTags);

	// Check username
	app.post('/user/checkname', database.checkname);

	// TODO: User signup and login
	app.post('/user/signup', user.checkUnlogged, user.signup, database.saveCredentials, user.setSession);
	app.post('/user/login', user.checkUnlogged, database.checkCredentials, user.login, user.setSession);

	// Post event info
	app.post('/saveEvent', user.authorize, database.saveEvent);
 }