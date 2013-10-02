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
	if ( Globel_isWeb() ) {
		return 0;
	}
	
	return gProblemIndex.length;
}

// 返回题目的基本信息
// obj.id,obj.type,obj.level,obj.tag
function Problem_GetBaseInfo(index) {
	if ( Globel_isWeb() ) {
		return null;
	}
	
	if ( index < 0 || index >= gProblemIndex.length ) {
        return null;
    }
    
    return gProblemIndex[index];
}

function getHttpRequest() {
	var xmlHttp = null;
	try{
		// Firefox, Opera 8.0+, Safari
		xmlHttp = new XMLHttpRequest();
	} catch (e) {
		// Internet Explorer
		try{
			xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
		}catch (e){
			try{
				xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
			}catch(e){
			}
		}
	}	
	return xmlHttp;
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) 
    	return unescape(r[2]);
    return null;
}
    
// 返回题目的详细信息
function Problem_RequestInfo(index, succeedCallback,failedCallback,context){
	if ( Global_isWeb() ) {
		var id = getQueryString("aid");
		if ( id == null ) {
			var data = '{"id":"1","type":"audio","level":"1","tag":"人物","content":{"inputkeys":"你打的没土小水话上下题白兔来草木宫说","inputwords":["王尼玛","周杰伦","姜太公","爱新觉罗"],"inform":"打一种动物","rightAnswers":["曾小贤"],"title":"门后的人是？","imageUrl":null,"musicUrl":"zxx","hasKnowledge":"1","knowledgeTipsID":"1"},"knowledgeTips":{"id":"1","image":"1.png","linkType":"news","linkText":"泰坦尼克号沉没背后的的惊天保险诈骗案","url":"http://tv.sohu.com/20101228/n278556355.shtml","title":"小白兔的医药疗效","text":"泰坦尼克号沉没背后的的惊天保险诈骗案你知道么？"}}';	
    		debugMsgOutput(data);
    		succeedCallback(JSON.parse(data), context);			
		} else {
			var xmlHttp = getHttpRequest();
			xmlHttp.open("GET", "http://www.liux123.com/queryproblem.php?aid=" + id);
			//xmlHttp.open("GET", "http://memeda.meme-da.com/queryproblem.php?aid=" + id);
			xmlHttp.onreadystatechange = function(){
				if( xmlHttp.readyState == 4 && xmlHttp.status == 200 ) {
					debugMsgOutput(xmlHttp.responseText);
					succeedCallback(JSON.parse(xmlHttp.responseText), context);
				}
			};
			xmlHttp.send(null);
			
			debugMsgOutput("---" + id);
		}
	} else {
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
}

Problem_Initialize();


