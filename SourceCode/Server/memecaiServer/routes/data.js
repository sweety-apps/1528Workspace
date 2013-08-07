
/*
 * GET home page.
 */

//var util = require('util');

exports.data_source_api = function(req, res){
    //res.redirect('./memecai/');
    //res.render('index', { title: 'Express' });
    var testJson = {
        id:"this is ID",
        value:"this is Value"
    };
    res.send(JSON.stringify(testJson));

    //res.write(JSON.stringify(testJson));
    //res.end();
};