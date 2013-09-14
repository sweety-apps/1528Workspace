/**
 * 获取游戏数据
 */

var gProblemIndex = new Array();

function Problem_Initialize() {
	// 读取索引文件getWritablePath
	var data = cc.FileUtils.getInstance().getStringFromFile("./problem/package.json");
    if ( data == null ) {
    	data = '{"index":[{"id":"1","type":"audio","level":"1","tag":"人物"},{"id":"2","type":"audio","level":"1","tag":"人物"},{"id":"3","type":"audio","level":"1","tag":"动画"},{"id":"4","type":"audio","level":"1","tag":"歌曲"},{"id":"5","type":"audio","level":"1","tag":"游戏"},{"id":"6","type":"audio","level":"1","tag":"人物"},{"id":"7","type":"audio","level":"1","tag":"人物"},{"id":"8","type":"audio","level":"1","tag":"电影"},{"id":"9","type":"audio","level":"1","tag":"游戏"},{"id":"10","type":"audio","level":"1","tag":"游戏"},{"id":"11","type":"audio","level":"1","tag":"人物"}],"pkgid":"1378400993","ver":"1"}';	
    }
    //
    var objJson = JSON.parse(data);
    var index = objJson.index;
    for (var i = 0; i < index.length; i ++) {
        var item = index[i];
        var obj = new Object;
        obj.id = item.id;
        obj.type = item.type;
        obj.level = item.level;
        obj.tag = item.tag;
        
        gProblemIndex.push(obj);
    }
}

function Problem_GetCount() {
	return gProblemIndex.length;
}

// 返回题目的基本信息
// obj.id,obj.type,obj.level,obj.tag
function Problem_GetBaseInfo(index) {
	if ( index < 0 || index >= gProblemIndex.length ) {
        return null;
    }
    
    return gProblemIndex[index];
}

// 返回题目的详细信息
function Problem_RequestInfo(index, succeedCallback,failedCallback,context){
	if ( index < 0 || index >= gProblemIndex.length ) {
        return failedCallback(context);
    }
    
    var id = gProblemIndex[index].id;
	var data = cc.FileUtils.getInstance().getStringFromFile("./problem/" + id);
	if ( data == null ) {
		data = '{"id":"1","type":"audio","level":"1","tag":"人物","content":{"inputkeys":"你打的没土小水话上下题白兔来草木宫说","inputwords":["王尼玛","周杰伦","姜太公","爱新觉罗"],"inform":"打一种动物","rightAnswers":["曾小贤"],"title":"门后的人是？","imageUrl":null,"musicUrl":"zxx","hasKnowledge":"1","knowledgeTipsID":"1"},"knowledgeTips":{"id":"1","image":"1.png","linkType":"news","linkText":"泰坦尼克号沉没背后的的惊天保险诈骗案","url":"http://tv.sohu.com/20101228/n278556355.shtml","title":"小白兔的医药疗效","text":"泰坦尼克号沉没背后的的惊天保险诈骗案你知道么？"}}';	
	}
	
    succeedCallback(JSON.parse(data), context);
}

Problem_Initialize();


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
