/**
 * Route handlers
 */
var mainHandler = require('./routes/mainHandler');
var user = require('./routes/user');
var event = require('./routes/event');
var database = require('./routes/database');

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
	app.post('/user/checkname', user.checkName);
	app.post('/user/checkemail', user.checkEmail);

	// TODO: User signup and login
	app.post('/user/signup', user.checkUnlogged, user.signup, user.setSession);
	app.post('/user/login', user.checkUnlogged, user.login, user.setSession);

	// event info
	app.get('/event', user.authorize, database.getEvent);
	app.post('/event', user.authorize, event.saveEvent);
	app.put('/event', user.authorize, database.updateEvent);
	app.delete('/event', user.authorize, database.deleteEvent)
 }