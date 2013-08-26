
/*
 * GET home page.
 */

//var util = require('util');

// 测试题目

var gTests = null;

function initTests()
{
   if(gTests == null)
   {
       gTests = [];

       //
       gTests[0] = {
           id:"00000",
           type:"text",
           level:"1",
           content:{
               inputkeys:"你打的没土小水话上下题白兔来草木宫说",
               inform:"打一种动物",
               rightanswer:"小白兔",
               title:"小白＋小白＝？",
               imageurl:"",
               musicurl:""
           },
           knowladgetips:{
               id:"1",
               text:"小白兔是一种可以种植的中草药，对蛋疼有很好的疗效。"
           }
       };

       gTests[1] = {
           id:"00001",
           type:"text",
           level:"1",
           content:{
               inputkeys:"水下题菊来草木宫说花小",
               inform:"一种给力植物",
               rightanswer:"小菊花",
               title:"向大菊花小时候是什么？",
               imageurl:"",
               musicurl:""
           },
           knowladgetips:{
               id:"2",
               text:"向日葵搞基之前是菊花。"
           }
       };

       gTests[2] = {
           id:"00002",
           type:"text",
           level:"2",
           content:{
               inputkeys:"鼻打车没爸小水长上下春哥兔子草木宫说",
               inform:"小新的歌词",
               rightanswer:"鼻子长",
               title:"大象大象...?",
               imageurl:"",
               musicurl:""
           },
           knowladgetips:{
               id:"3",
               text:"这是一个知识提示。"
           }
       };

       gTests[3] = {
           id:"00004",
           type:"text",
           level:"1",
           content:{
               inputkeys:"你打的没土小萝莉上下题白兔来草木宫说",
               inform:"小女孩的别名",
               rightanswer:"小萝莉",
               title:"怪蜀黍最喜欢什么？",
               imageurl:"",
               musicurl:""
           },
           knowladgetips:{
               id:"4",
               text:"怪叔叔。"
           }
       };
   }
}

function getTestAt(index)
{
    initTests();
    index %= gTests.length;
    return gTests[index];
}

function getErrorString()
{
    return "{error_code:\"-1\"}";
}

// 输出逻辑



exports.data_source_api = function(req, res){
    //res.redirect('./memecai/');
    //res.render('index', { title: 'Express' });

    var should_response = false;
    var response_string = "";

    // 解析请求参数
    // 临时变量
    var testIndexString = req.param("index",null);

    // 判断变量
    var testIndex = 0;

    // 转译解析及获取数据逻辑
    if(testIndexString != null)
    {
        testIndex = parseInt(testIndexString);
        should_response = true;
    }

    // 判断返回
    if(should_response)
    {
        response_string = JSON.stringify(getTestAt(testIndex));
    }
    else
    {
        response_string = getErrorString();
    }

    //返回
    //response_string = encodeURI(response_string);
    res.setHeader("Content-Type","text/json; charset=utf-8");
    //res.setHeader("charset","utf-8");
    res.send(response_string);

    //res.write(JSON.stringify(testJson));
    //res.end();
};