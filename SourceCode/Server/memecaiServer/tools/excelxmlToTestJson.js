/**
 * Created with JetBrains WebStorm.
 * User: leejustin
 * Date: 13-8-27
 * Time: 上午1:06
 * To change this template use File | Settings | File Templates.
 */

var THIS_LOG_TAG = "[EXCEL TO JSON]";

//需要加个回调啥的
exports.excelxmlToTestJson = function(inputFilePath, outPutFilePath, finishCallBack)
{
    // 默认参数
    var defaultInputFilePath = "./excelxmlToTestJsonFileSpace/Input.xml";
    var defaultOutputFilePath = "./excelxmlToTestJsonFileSpace/Output.json";

    // 配置
    var enableDebugLog = true;//false;//

    // 对应标签
    var kContentTag = "";

    // 转换逻辑
    if(inputFilePath == null || inputFilePath == undefined || inputFilePath.length == 0)
    {
        inputFilePath = defaultInputFilePath;
    }

    if(outPutFilePath == null || outPutFilePath == undefined || outPutFilePath.length == 0)
    {
        outPutFilePath = defaultOutputFilePath;
    }

    var xmlreaderObj = require('xmlreader');
    var inputFS = require('fs');
    var outputFS = require('fs');

    inputFS.readFile(inputFilePath,function(err,data)
    {
        if(err)
        {
            console.log(THIS_LOG_TAG + "[Error] Read xml False For File:"+inputFilePath);
            console.log(err.message);
        }

        var xml_string = data.toString();

        if(xml_string == null || xml_string == undefined || xml_string.length == 0)
        {
            console.log(THIS_LOG_TAG + "[Error] Data Is Not String For File:"+inputFilePath);
            return;
        }

        //读到文件了
        if(enableDebugLog)
        {
            console.log(THIS_LOG_TAG + "==========Read File Succeed:"+inputFilePath+" {Raw Data}===============");
            console.log(xml_string);
            console.log(THIS_LOG_TAG + "==========Read File Succeed:"+inputFilePath+" {End Of Raw Data}===============");
        }

        //解析文件
        xmlreaderObj.read(xml_string, function(errors, response)
        {
            if(null !== errors ){
                console.log(THIS_LOG_TAG + "[Error]Parse xml False For File:"+inputFilePath);
                console.log(THIS_LOG_TAG + errors);
                return;
            }

            if(enableDebugLog)
            {
                console.log(THIS_LOG_TAG + "==========Parse File Succeed:"+inputFilePath+" {Parsed Data}===============");
                console.log(response);
                console.log(THIS_LOG_TAG + "==========Parse File Succeed:"+inputFilePath+" {End Of Parsed Data}===============");
            }

            console.log(response.Workbook.Worksheet.array[0].Table.Row.array[0].Cell.array[1].Data.text());

            var singleTest = {
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

            var resultString = JSON.stringify(singleTest);
            outputFS.writeFile(outPutFilePath,resultString,function(err){
                if(err) throw err;
                console.log("excelxmlToTestJson() Finished From {"+inputFilePath+"} To {"+outPutFilePath+"}");
            });

            //console.log( response.response.text() );
        });

        /*
        var jsonObj = JSON.parse(data);
        var space = ' ';
        var newLine = '\n';
        var chunks = [];
        var length = 0;

        for(var i=0,size=jsonObj.length;i<size;i++){
            var one = jsonObj[i];
            //what value you want
            var value1 = one['value1'];
            var value2 = one['value2'];
        ....
            var value = value1 +space+value2+space+.....+newLine;
            var buffer = new Buffer(value);
            chunks.push(buffer);
            length += buffer.length;
        }

        var resultBuffer = new Buffer(length);
        for(var i=0,size=chunks.length,pos=0;i<size;i++){
            chunks[i].copy(resultBuffer,pos);
            pos += chunks[i].length;
        }

        fs.writeFile('./resut.text',resultBuffer,function(err){
            if(err) throw err;
            console.log('has finished');
        });
        */

    });
};

exports.excelxmlToTestJson(null,null);
//var doTest = require('excelxmlToTestJson');
//doTest.excelxmlToTestJson(null,null);
