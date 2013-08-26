
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.redirect('./memeda/');
  //res.render('index', { title: 'Express' });
};