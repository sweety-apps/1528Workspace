
/*
 * GET home page.
 */

exports.data_source_api = function(req, res){
    //res.redirect('./memecai/');
    //res.render('index', { title: 'Express' });
    res.write('testData0');
    res.end();
};