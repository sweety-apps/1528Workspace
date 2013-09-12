/**
 * 获取游戏数据
 */

//var kDataServerHost = "www.mytestserver.com";
var kDataServerHost = "223.4.33.112";
//var kDataServerHost = "127.0.0.1";
var kTestDataAPI = "http://"+kDataServerHost+"/data";

var gDataAcessInitialized = false;

var gShouldUseLocalTest = true;//false;

function initAllDataAccess()
{
    gDataAcessInitialized = true;
}

function checkInited()
{
    if(!gDataAcessInitialized)
    {
        initAllDataAccess();
    }
}

// 基础请求

function requestJSONDataObject(url,succeedCallback,failedCallback,context)
{
    if(succeedCallback != null)
    {
        var xhr = new XMLHttpRequest();
        //debugMsgOutput(xhr);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    debugMsgOutput(xhr.responseText);
                    cc.log(xhr.responseText);
                    var jsonString = xhr.responseText;
                    var testObj = JSON.parse(jsonString);
                    succeedCallback(testObj,context);
                } else {
                    debugMsgOutput("failed");
                    if(failedCallback != null)
                    {
                        failedCallback(context);
                    }
                }
            }
        };
        debugMsgOutput(url);
        //debugMsgOutput(xhr.readyState);//0
        xhr.open("GET", url, true);
        //debugMsgOutput(xhr.readyState);//1
        //xhr.setRequestHeader('Content-Type','application/xml');
        xhr.send();
    }
}

// 不同逻辑对应的请求

var gCurrentTestIndex = 0;

// test Game Logic
var gTests0 = {
    id:"00001",
    type:"text",
    level:"1",
    content:{
        inputkeys:"水下题菊来草木宫说花小",
        inform:"一种给力植物",
        rightanswer:"小菊花123",
        title:"向大菊花小时候是什么？",
        imageurl:"",
        musicurl:""
    },
    knowladgetips:{
        id:"2",
        text:"向日葵搞基之前是菊花。"
    }
};

function requestTestDataObject(succeedCallback,failedCallback,context)
{
    checkInited();
    var url = kTestDataAPI + "?index=" + gCurrentTestIndex;
    if(gShouldUseLocalTest)
    {
        succeedCallback(gTests0,context);
    }
    else
    {
        requestJSONDataObject(url,succeedCallback,failedCallback,context);
    }
    ++gCurrentTestIndex;
}

//读文件测试代码
function testReadFile()
{
	if(cc.FileUtils.getInstance().isFileExist("./TestCCB/Output/1"))
    {
        cc.log("<<FILE LOADED>> Load Succeed!<<FILE LOADED>>");
        var data = cc.FileUtils.getInstance().getStringFromFile("./TestCCB/Output/2");
        //data = cc.FileUtils.getInstance().getFileData("./TestCCB/Output.zip","r",0);
        //data = cc.FileUtils.getInstance().getFileDataFromZip("./TestCCB/Output.zip","Output/1",0);
        result = "一二三" + data;
        /*
        for(var i = 0; i < data.length; i++) {
            result = result + String.fromCharCode(data[i]);
        }*/
        //result = new String(result.getBytes("iso-8859-1"),"utf-8");
        cc.log(result);
    }
    else
    {
        cc.log("[FILE LOADING]Load Failed![FILE LOADING]");
    }
}