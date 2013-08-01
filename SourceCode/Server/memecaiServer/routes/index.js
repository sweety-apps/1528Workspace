
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.redirect('./memecai/');
  //res.render('index', { title: 'Express' });
};