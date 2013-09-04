/**
 * Created with JetBrains WebStorm.
 * User: leejustin
 * Date: 13-8-27
 * Time: 上午1:06
 * To change this template use File | Settings | File Templates.
 */

// 配置
var THIS_LOG_TAG = "[EXCEL TO JSON]";
var gEnableDebugLog = false;

// 字符串常用工具函数
function isString(d) {
    return typeof d === 'string';
}

function encrypt(str,secret) {
    var crypto = require('crypto');
    var cipher = crypto.createCipher('aes192', secret);
    var enc = cipher.update(str,'utf8','hex');
    enc += cipher.final('hex');
    return enc;
}

//function String.prototype.Trim() { return this.replace(/(^/s*)|(/s*$)/g, ""); }   // 去掉左右空格
//function String.prototype.Ltrim() { return this.replace(/(^/s*)/g, ""); }            // 去掉左空格
//function String.prototype.Rtrim() { return this.replace(/(/s*$)/g, ""); }            // 去掉右空格

///////////////////////

// 把 excel 的大 xml 解析成一个2元数组
function convertXmlObjectToTable(xmlObject)
{
    var table = new Array();
    //colCount = xmlObject.Workbook.Worksheet.array[0].;
    var tableAttr = xmlObject.Workbook.Worksheet.array[0].Table.attributes();////ss:ExpandedColumnCount;
    var colCountString = tableAttr["ss:ExpandedColumnCount"];
    var colCount = parseInt(colCountString);
    var lineCount = xmlObject.Workbook.Worksheet.array[0].Table.Row.array.length;

    try
    {
        for(var l = 0; l < lineCount; ++l)
        {
            var line = new Array();
            // 清空行中的元素
            for(var i = 0; i < colCount; i++)
            {
                line[i] = null;
            }
            // 读入行中每个元素
            var c = 0;
            var rawLine = xmlObject.Workbook.Worksheet.array[0].Table.Row.array[l].Cell.array;
            if(rawLine == null || rawLine == undefined)
            {
                // 行中只有一个元素
                var tempCell = xmlObject.Workbook.Worksheet.array[0].Table.Row.array[l].Cell;
                rawLine = new Array();
                rawLine[0] = tempCell;
            }
            var rowIndex = c;
            while(c < colCount)
            {
                if(c < rawLine.length)
                {
                    var rawCell = rawLine[c];
                    var cellAttr = rawCell.attributes();
                    if(cellAttr != null && cellAttr != undefined)
                    {
                        var jumpIndexString = cellAttr["ss:Index"];
                        if(jumpIndexString != null && jumpIndexString != undefined && jumpIndexString.length > 0)
                        {
                            rowIndex = parseInt(jumpIndexString) - 1;
                        }
                    }
                    line[rowIndex] = rawCell.Data.text();
                }
                c++;
                rowIndex++;
            }
            table[l] = line;
        }
    }
    catch (err)
    {
        throw err;
    }


    return table;
}

// 把 excel 的 xml 解析成题目格式的 json 数组; 默认第一行是标题，第二行开始都是题目内容
function convertXmlObjectToTestJsonObject(xmlObject)
{
    var table = convertXmlObjectToTable(xmlObject);
    var jsonObjects = null;

    var kNotDefinedIndex = -1;
    var kKeyAt = 0;
    var kIndexAt = 1;
    var kValuesAt = 2;

    // 列名配置
    var colType = new Array("模式",kNotDefinedIndex,null);    //题目类型:画图｜偷听
    var colLevel = new Array("难度",kNotDefinedIndex,null);    //难度级别:1-6
    var colInputKeys = new Array("干扰词",kNotDefinedIndex,null); //输入答案区间及干扰词
    var colTag = new Array("标签",kNotDefinedIndex,null); //输入答案区间及干扰词
    var colInform = new Array("暗示",kNotDefinedIndex,null);   //花钱的提示
    var colRightAnswer = new Array("答案",kNotDefinedIndex,null);  //正确答案
    var colTitle = new Array("问题",kNotDefinedIndex,null);   //问题文字
    var colImageUrl = new Array("素材编号",kNotDefinedIndex,null);   //图片名
    var colMusicUrl = new Array("素材编号",kNotDefinedIndex,null);   //文字名
    var colKnowledgeImage = new Array("答对图片",kNotDefinedIndex,null);   //答对知识提示图片
    var colKnowledgeLinkType = new Array("超链接类型",kNotDefinedIndex,null); //答对知识提示超链接类型:视频|音乐|新闻|百科
    var colKnowledgeUrl = new Array("超链接",kNotDefinedIndex,null);  //答对知识提示超链接
    var colKnowledgeTalkText = new Array("答对对话",kNotDefinedIndex,null);  //答对知识提示对话
    var colKnowledgeTitle = new Array("超链接标题",kNotDefinedIndex,null);   //答对知识提示标题

    // 做列脚标映射
    var indexDictionary = new Array(
        colType,
        colLevel,
        colInputKeys,
        colTag,
        colInform,
        colRightAnswer,
        colTitle,
        colImageUrl,
        colMusicUrl,
        colKnowledgeImage,
        colKnowledgeLinkType,
        colKnowledgeUrl,
        colKnowledgeTalkText,
        colKnowledgeTitle
    );

    //console.log(response.Workbook.Worksheet.array[0].Table.Row.array[0].Cell.array[1].Data.text());

    var coloumnCount = table[0].length;
    var lineCount = table.length;

    //解析列名对应的index
    for(var i = 0; i < coloumnCount; ++i)
    {
        var title = table[0][i];//xmlObject.Workbook.Worksheet.array[0].Table.Row.array[0].Cell.array[i].Data.text();
        for(var j = 0; j < indexDictionary.length; j++)
        {
            var cellObject = indexDictionary[j];
            var cellObjectKeyString = cellObject[kKeyAt];
            if(title.indexOf(cellObjectKeyString) >= 0)
            {
                cellObject[kIndexAt] = i;
            }
        }
    }

    // 解析内容
    jsonObjects = new Array();
    try
    {
        for(var l = 1; l < lineCount; ++l)
        {
            for(var j = 0; j < indexDictionary.length; j++)
            {
                var cellObject = indexDictionary[j];
                var cellObjectIndex = cellObject[kIndexAt];
                if(cellObjectIndex != kNotDefinedIndex)
                {
                    var value = table[l][cellObjectIndex];//xmlObject.Workbook.Worksheet.array[0].Table.Row.array[l].Cell.array[cellObjectIndex].Data.text();

                    //去掉前后空格
                    if(isString(value))
                    {
                        value.trim();
                    }

                    //纠错
                    if(value == undefined || value == null)
                    {
                        value == "";
                    }

                    //填值
                    var cellValues = cellObject[kValuesAt];
                    if(cellValues == null)
                    {
                        cellValues = new Array();
                        for(var ti = 0; ti < lineCount; ++ti)
                        {
                            cellValues[ti] = null;
                        }
                        cellObject[kValuesAt] = cellValues;
                    }
                    cellValues[l-1] = value;
                }
            }
        }
    }
    catch(err)
    {
        throw err;
    }


    // 转成json对象
    for(var l = 1; l < lineCount; ++l)
    {
        //题目格式例子
        var singleTest = {
            id:"" + l,
            type:"text",
            level:"1",
            tag:[
                "电影",
                "明星"
            ],
            content:{
                inputkeys:"你打的没土小水话上下题白兔来草木宫说",
                inform:"打一种动物",
                rightAnswers:[
                    "小白兔",
                    "小兔子"
                ],
                title:"小白＋小白＝？",
                imageUrl:"1.png",
                musicUrl:"1.mp3"
            },
            knowledgeTips:{
                image:"1.png",
                linkType:"news",
                url:"http://www.meme-da.com",
                title:"小白兔的医药疗效",
                text:"小白兔是一种可以种植的中草药，对蛋疼有很好的疗效。"
            }
        };

        // TODO: 题目id生成

        for(var j = 0; j < indexDictionary.length; j++)
        {
            var cellObject = indexDictionary[j];
            var cellObjectIndex = cellObject[kIndexAt];
            if(cellObjectIndex != kNotDefinedIndex)
            {
                var cellValue = cellObject[kValuesAt][l];
                var cellObjectKeyString = cellObject[kKeyAt];

                if(cellObjectKeyString == colType[kKeyAt])
                {
                    singleTest.type = cellValue;
                }
                else if(cellObjectKeyString == colLevel[kKeyAt])
                {
                    singleTest.level = cellValue;
                }
                else if(cellObjectKeyString == colTag[kKeyAt])
                {
                    singleTest.tag = cellValue;
                }
                else if(cellObjectKeyString == colInform[kKeyAt])
                {
                    singleTest.content.inform = cellValue;
                }
                else if(cellObjectKeyString == colRightAnswer[kKeyAt])
                {
                    singleTest.content.rightAnswers = cellValue;
                }
                else if(cellObjectKeyString == colTitle[kKeyAt])
                {
                    singleTest.content.title = cellValue;
                }
                else if(cellObjectKeyString == colImageUrl[kKeyAt])
                {
                    singleTest.content.imageUrl = cellValue;
                }
                else if(cellObjectKeyString == colMusicUrl[kKeyAt])
                {
                    singleTest.content.musicUrl = cellValue;
                }
                else if(cellObjectKeyString == colInputKeys[kKeyAt])
                {
                    singleTest.content.inputkeys = cellValue;
                }
                else if(cellObjectKeyString == colKnowledgeImage[kKeyAt])
                {
                    singleTest.knowledgeTips.image = cellValue;
                }
                else if(cellObjectKeyString == colKnowledgeLinkType[kKeyAt])
                {
                    singleTest.knowledgeTips.linkType = cellValue;
                }
                else if(cellObjectKeyString == colKnowledgeUrl[kKeyAt])
                {
                    singleTest.knowledgeTips.url = cellValue;
                }
                else if(cellObjectKeyString == colKnowledgeTalkText[kKeyAt])
                {
                    singleTest.knowledgeTips.text = cellValue;
                }
                else if(cellObjectKeyString == colKnowledgeTitle[kKeyAt])
                {
                    singleTest.knowledgeTips.title = cellValue;
                }

            }
        }

        jsonObjects[l - 1] = singleTest;
    }

    // 清理现场
    indexDictionary = null;

    return jsonObjects;
}

function MakePackageID() {
    var date = new Date();
    var value = "" + Math.floor(date.getTime() / 1000);
    return value;
}

/**
 * 转换xml为json对象
 @param {string} [inputFilePath]
 @param {Function} [finishCallBack]
 @return {string} [json]
 */
exports.excelxmlToTestJson = function(inputFilePath, finishCallBack)
{
    // 转换逻辑
    var xmlreaderObj = require('xmlreader');
    var inputFS = require('fs');

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
        if(gEnableDebugLog)
        {
            console.log(THIS_LOG_TAG + "==========Read File Succeed:"+inputFilePath+" {Raw Data}===============");
            console.log(xml_string);
            console.log(THIS_LOG_TAG + "==========Read File Succeed:"+inputFilePath+" {End Of Raw Data}===============");
        }

        //解析文件
        xmlreaderObj.read(xml_string, function(errors, response)
        {
            if(null !== errors ){
                if ( gEnableDebugLog ) {
                    console.log(THIS_LOG_TAG + "[Error]Parse xml False For File:"+inputFilePath);
                    console.log(THIS_LOG_TAG + errors);
                }
                return;
            }

            if(gEnableDebugLog)
            {
                console.log(THIS_LOG_TAG + "==========Parse File Succeed:"+inputFilePath+" {Parsed Data}===============");
                console.log(response);
                console.log(THIS_LOG_TAG + "==========Parse File Succeed:"+inputFilePath+" {End Of Parsed Data}===============");
            }

            var jsonObj = convertXmlObjectToTestJsonObject(response);

            if(finishCallBack != null && finishCallBack != undefined)
            {
                finishCallBack(jsonObj);
            }

            //console.log( response.response.text() );
        });

    });
};

/**
 * 进行打包操作
 @param {string} [jsonObj]
 @param {string} [outPutFilePath]
 @param {string} [packageID]
 @param {string} [packageVersion]
 @param {Function} [finishCallBack]
 @return {string} [json]
 */
exports.makeTestPackage = function(jsonObj, outPutFilePath, packageID, packageVersion, finishCallBack)
{
    var outputFS = require('fs');

    var pkgid = packageID;	// 包ID
    var pkgver = packageVersion;	// 包版本,默认1

    // 对转义好的数据做分组和打包
    var allCount = jsonObj.length;
    var count = 0;
    var indexArray = new Array();

    outputFS.mkdirSync(outPutFilePath);

    for ( var i = 0; i < jsonObj.length; i ++ ) {
        var jsonItem = jsonObj[i];
        var id = jsonItem["id"];

        var itemInfo = new Object();
        itemInfo.id = jsonItem["id"];
        itemInfo.type = jsonItem["type"];
        itemInfo.level = jsonItem["level"];
        itemInfo.tag = jsonItem["tag"];

        indexArray.push(itemInfo);

        var resultString = JSON.stringify(jsonItem);
        //resultString = encrypt(resultString, "F6BB1731-E8CC-42A0-A033-6CE82B5E7A03");
        outputFS.writeFile(outPutFilePath + "/" + id,resultString,function(err){
            count ++;
            if ( count == allCount ) {
                ToJsonFinish(pkgid, pkgver, indexArray, outPutFilePath, function(){
                    finishCallBack();
                });
            }
            if(err) throw err;
            if ( gEnableDebugLog ) {
                console.log("excelxmlToTestJson() Finished From {"+inputFilePath+"} To {"+outPutFilePath+"}");
            }
        });
    }
};

/**
 * 将excel的xml题库打包
 @param {string} [inputFilePath]
 @param {string} [outPutFilePath]
 @param {Function} [finishCallBack]
 @return {string} [json]
 */
exports.createTestPackageFromExcelXml = function(inputFilePath, outPutFilePath, finishCallBack)
{
    // 默认参数
    var defaultInputFilePath = __dirname + "/excelxmlToTestJsonFileSpace/Input.xml";
    if(inputFilePath == null || inputFilePath == undefined || inputFilePath.length == 0)
    {
        inputFilePath = defaultInputFilePath;
    }

    var pkgid = MakePackageID();	// 包ID
    var pkgver = "1";	// 包版本,默认1
    var defaultOutputFilePath = __dirname + "/excelxmlToTestJsonFileSpace/" + pkgid + "_" + pkgver + "";
    if(outPutFilePath == null || outPutFilePath == undefined || outPutFilePath.length == 0)
    {
        outPutFilePath = defaultOutputFilePath;
    }

    var thisObj = this;
    thisObj.excelxmlToTestJson(inputFilePath, function (jsonObj){
        thisObj.makeTestPackage(jsonObj,outPutFilePath,pkgid,pkgver,function (){
            if(finishCallBack != null && finishCallBack != undefined)
            {
                finishCallBack(jsonObj);
            }
        });
    });
};

function ToJsonFinish(id, ver, indexArray, outPutFilePath, finishCallBack) {
    // 保存成JSON，创建索引文件
    var fs = require('fs');
    var obj = new Object();
    obj.index = indexArray;
    obj.pkgid = id;	// 包ID
    obj.ver = ver;		// 包版本
    fs.writeFile(outPutFilePath + "/package.json",JSON.stringify(obj),function(err){
        if(err) throw err;
        // 对outputFilePath下的文件打包
        Compress(outPutFilePath,finishCallBack);
    });
}

function EnumAllFiles(fs, outPutFilePath, files, parentDir) {
    var dirList = fs.readdirSync(outPutFilePath);
    dirList.forEach(function(item){
        if(fs.statSync(outPutFilePath + item).isDirectory()){
            EnumAllFiles(fs, outPutFilePath + item + "/", files, parentDir + item + "/");
        }else{
            // 是文件
            var obj = new Object();
            obj.name = parentDir + item;
            obj.path = outPutFilePath + item;
            files.push(obj);
        }
    });
}

function Compress(outPutFilePath,finishCallBack) {
    var outputZip = outPutFilePath + ".zip";
    var fs = require('fs');
    var files = new Array();
    EnumAllFiles(fs, outPutFilePath + "/", files, "");

    var zip = require("node-native-zip");
    var archive = new zip();
    archive.addFiles(files, function(err) {
        if(err) throw err;
        var buff = archive.toBuffer();
        fs.writeFile(outputZip, buff, function (err) {
            // 完成
            if(err) throw err;
            finishCallBack();
        });
    });
}

// 这段代码是测试
//exports.createTestPackageFromExcelXml(null,null);
