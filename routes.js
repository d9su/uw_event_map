/**
 * Route handlers
 */
var mainHandler = require('./routes/mainHandler');
var user = require('./routes/user');
var eventInfoHandler = require('./routes/eventInfoHandler');
var database = require('./routes/database');
var kinvey = require('./routes/kinvey');

/**
 * Routes
 */
 module.exports = function(app) {

 	// Home page
	app.get('/', mainHandler.getIndex);

	// Fetch tags
	app.get('/tags', database.fetchTags);

	// TODO: User signup and login
	app.get('/users', user.list);

	app.get('/login', kinvey.login);
	app.get('/oauth', mainHandler.login);
	app.get('/oauth/token', kinvey.grantAccessToken);

	// Post event info
	app.post('/event', database.saveEvent);

 }