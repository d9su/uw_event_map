
/*
 * GET home page.
 */

exports.gethome = function(req, res){
  res.render('home', { title: 'CompuzZ' });
};
