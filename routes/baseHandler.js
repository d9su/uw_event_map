/**
 * Base handler
 */

// Mysql 
var _mysql = require('mysql');


// Mysql connection
exports.getDbHandle = function() {
	var mysql = _mysql.createConnection({
	    host: 'localhost',
	    port: 3306,
	    user: 'compuzz',
	    password: 'goodegg',
	    database: 'Compuzz',
	});
	return mysql;
};
