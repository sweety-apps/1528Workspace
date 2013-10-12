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

exports.createTestPackageFromExcelXml = function()
{
    // 默认参数
    var inputFilePath = __dirname + "/excelxmlToTestJsonFileSpace/Input";
	var outPutFilePath = __dirname + "/excelxmlToTestJsonFileSpace/output";
	
    var xmlreaderObj = require('xmlreader');
    var inputFS = require('fs');
    var outputFS = require('fs');
	
    inputFS.readFile(inputFilePath + "/Input.xml",function(err,data)
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
                console.log(THIS_LOG_TAG + "==========Parse File Succeed:"+inputFilePath+" {End Of Parsed Data}===============");
            }

			var arrays = response.root.item.array;
			var indexs = new Array();
			for (var i = 0; i < arrays.length; i ++ ) {
				var index = MakeQuestion(i+1, inputFilePath, outPutFilePath, arrays[i]);
				if ( index != null ) {
					indexs.push(index);
				
				}
			}
			
			var resultString = JSON.stringify(indexs);
			outputFS.writeFile(outPutFilePath + "/package.json",resultString,function(err){
				if(err) {
					console.log("WriteFile error : package.json");
					throw err;
				}
			});
        });
    });
}
 
function trim(str){   
    return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');   
}  

// 返回该问题的索引
MakeQuestion = function (id, inputPath, outputPath, node) {
	if ( node.e == null || node.f == null || node.g == null ) {
		// 
		console.log("error : " + id + "  " + node.g);
		return ;
	}
	
    var outputFS = require('fs');
    var path = require('path');
	
	var objRet = new Object;
	var obj = new Object;
	obj.id = id;	// 问题ID号
	obj.level = node.e.text();
	obj.label = node.f.text();
	obj.rightanswer = node.g.text();
	obj.rightanswer = trim(obj.rightanswer);
	if ( node.i == null ) { 
		obj.achievement = "";
	} else {
		obj.achievement = node.i.text();
		objRet.achievement = obj.achievement;
	}
	
	if ( node.j == null ) { 
		obj.feel = "";
	} else {
		obj.feel = node.j.text();
	}

	// 判断图片和音频是否存在
	if ( !outputFS.existsSync(inputPath + "/pic/" + obj.rightanswer + ".jpg") ) {
		console.log("error : jpg not exists " + obj.rightanswer);
	}
	
	if ( !outputFS.existsSync(inputPath + "/music/" + obj.rightanswer + ".mp3") ) {
		console.log("error : mp3 not exists " + obj.rightanswer);
		return null;
	}
	
	
	// 把图片和音频拷贝到指定位置
	if ( outputFS.existsSync(inputPath + "/pic/" + obj.rightanswer + ".jpg") ) {
		outputFS.renameSync(inputPath + "/pic/" + obj.rightanswer + ".jpg", inputPath + "/pic/" + obj.id + ".jpg");
	}
	
	if ( outputFS.existsSync(inputPath + "/music/" + obj.rightanswer + ".mp3") ) {
		outputFS.renameSync(inputPath + "/music/" + obj.rightanswer + ".mp3", inputPath + "/music/" + obj.id + ".mp3");
	}
	

	obj.rightanswer = obj.rightanswer.replace("-2", "");
	
    var resultString = JSON.stringify(obj);
        //resultString = encrypt(resultString, "F6BB1731-E8CC-42A0-A033-6CE82B5E7A03");
    outputFS.writeFile(outputPath + "/" + id,resultString,function(err){
        if(err) {
			console.log("WriteFile error : " + resultString);
			throw err;
		}
    });
		
	objRet.id = id;
	objRet.level = node.e.text();
	if ( node.b != null ) { 
		objRet.pos = node.b.text();
	}
	return objRet;
}