/**
 * Route handlers
 */
var mainHandler = require('./routes/mainHandler');
var user = require('./routes/user');
var eventInfoHandler = require('./routes/eventInfoHandler');
var database = require('./routes/database')

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

	// Post event info
	app.post('/event', eventInfoHandler.saveEventInfo);
 }