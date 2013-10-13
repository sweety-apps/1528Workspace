/**
 * 获取游戏数据
 */

var gProblemIndex = new Array();

function Problem_MakeSubArray(arrayLevel, arrayCompose) {
	var retArr = new Array();
	for ( var i = 1; i < arrayLevel.length; i ++ ) {
		var arr = arrayLevel[i];
		if ( arrayCompose[i] == null ) {
			// 取剩余的全部
			while ( arr.length != 0 ) {
				retArr.push(arr.pop());
			}
		} else {
			//
			var num = Math.floor(1.0 * arr.length * arrayCompose[i] / 100);	// 需要取的题目数
			for ( var j = 0; j < num; j ++ ) {
				retArr.push(arr.pop());
			}
		}
	}
    
	return retArr;
};

//
function RandSort(x, y) {
	if ( Math.random() >= 0.5 ) {
		return 1;
	} else {
		return -1;
	}
};

function Problem_MakeRepositionArray(arrayFixed, arrayLevel, num) {
    for ( var i = 1; i < arrayLevel.length; i ++ ) {
        arrayLevel[i].sort(RandSort);
    }
    
	var compose = new Array();
	compose[0] = 70;
	compose[1] = 20;
	compose[2] = 10;
	compose[3] = 0;
	compose[4] = 0;
	var subIndexs = Problem_MakeSubArray(arrayLevel, compose);
	subIndexs.sort(RandSort);
    
	compose[0] = 20;
	compose[1] = 50;
	compose[2] = 20;
	compose[3] = 10;
	compose[4] = 0;
	var tmpIndexs = Problem_MakeSubArray(arrayLevel, compose);
	tmpIndexs.sort(RandSort);
	
	subIndexs = subIndexs.concat(tmpIndexs);
    
	compose[0] = null;
	compose[1] = 20;
	compose[2] = 40;
	compose[3] = 20;
	compose[4] = 10;
	tmpIndexs = Problem_MakeSubArray(arrayLevel, compose);
	tmpIndexs.sort(RandSort);
	
	subIndexs = subIndexs.concat(tmpIndexs);
    
	compose[0] = 0;
	compose[1] = null;
	compose[2] = 20;
	compose[3] = 50;
	compose[4] = 20;
	tmpIndexs = Problem_MakeSubArray(arrayLevel, compose);
	tmpIndexs.sort(RandSort);
	
	subIndexs = subIndexs.concat(tmpIndexs);
    
	compose[0] = 0;
	compose[1] = 0;
	compose[2] = null;
	compose[3] = null;
	compose[4] = null;
	tmpIndexs = Problem_MakeSubArray(arrayLevel, compose);
	tmpIndexs.sort(RandSort);
	
	subIndexs = subIndexs.concat(tmpIndexs);

    var indexs = new Array();
    var j = 0;
    debugMsgOutput("num " + num);
    for ( var i = 0; i < num; i ++ ) {
        if ( arrayFixed["" + (i+1)] != null ) {
            debugMsgOutput("fixed " + arrayFixed[i+1]);
            indexs.push(parseInt(arrayFixed[i+1]));
        } else {
            indexs.push("" + parseInt(subIndexs[j]));
            j ++;
        }
    }
    
    sys.localStorage.setItem("problem_index", indexs.join(","));
    
    debugMsgOutput("indexs " + subIndexs.length);
    debugMsgOutput("indexs " + indexs.length);
    
    // test
    for ( var i = 0; i < indexs.length; i ++) {
        for ( var j = i + 1; j < indexs.length; j ++ ) {
            if ( indexs[i] == indexs[j] ) {
                debugMsgOutput(" error" );
                throw(",,");
            }
        }
    }
    
    return indexs;
};

// 返回重排后的索引列表
function Problem_GetRepositionArray() {
	var indexs = sys.localStorage.getItem("problem_index");
	var indexArray = null;
	if ( indexs != null ) {
        debugMsgOutput("indexs " + indexs);
        
		indexArray = indexs.split(",");
		if ( indexArray == null || indexArray.length != gProblemIndex.length ) {
			indexArray = null;
		}
	}
	return indexArray;
};

function Problem_Reposition(indexArrays) {
	if ( indexArrays.length == gProblemIndex.length ) {
        var objArr = new Array();
        
		for ( var i = 0; i < indexArrays.length; i ++ ) {
			if ( indexArrays[i] != i ) {
				// 修改位置
				var index = indexArrays[i];
                
                objArr.push(gProblemIndex[index]);
			}
		}
        
        gProblemIndex = objArr;
        
        for ( var i = 0; i < gProblemIndex.length; i ++ ) {
            debugMsgOutput("**-- " + gProblemIndex[i].id);
        }
	}
};

function Problem_Initialize() {
	// 读取索引文件getWritablePath
	var data = cc.FileUtils.getInstance().getStringFromFile("./problem/package.json");
    if ( data == null ) {
    	data = '[{"id":1,"level":"1"}]';
    }
    
    var arrayLevel = new Array();
    arrayLevel[1] = new Array();
    arrayLevel[2] = new Array();
    arrayLevel[3] = new Array();
    arrayLevel[4] = new Array();
    arrayLevel[5] = new Array();
    var arrayFixed = new Array();
    
    //
    var objJson = JSON.parse(data);
    var index = objJson;
    debugMsgOutput("length " + index.length);
    for (var i = 0; i < index.length; i ++) {
        var item = index[i];
        var obj = new Object;
        obj.id = item.id;
        obj.level = parseInt("" + item.level);
        obj.achievement = item.achievement;
        obj.pos = item.pos;
        
        if ( obj.pos != null && obj.pos != "" && obj.pos != undefined ) {
        	arrayFixed["" + obj.pos] = i;
        } else {
        	arrayLevel[obj.level].push(i);
        }
        
        gProblemIndex.push(obj);
    }
    
    debugMsgOutput("Obj num " + arrayFixed.length);
    
    var indexArrays = Problem_GetRepositionArray();
    if ( indexArrays == null ) {
    	indexArrays = Problem_MakeRepositionArray(arrayFixed, arrayLevel, index.length);
    }

    // 对题目顺序重新排列
    Problem_Reposition(indexArrays);
    
    arrayLevel = null;
    arrayFixed = null;
}

function Problem_GetCount() {
	if ( Global_isWeb() ) {
		return 0;
	}
	
	return gProblemIndex.length;
}

// 返回题目的基本信息
// obj.id,obj.type,obj.level,obj.tag
function Problem_GetBaseInfo(index) {
	if ( Global_isWeb() ) {
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
            /*
             var data = '{"id":"1","type":"audio","level":"1","tag":"人物","content":{"inputkeys":"你打的没土小水话上下题白兔来草木宫说","inputwords":["王尼玛","周杰伦","姜太公","爱新觉罗"],"inform":"打一种动物","rightAnswers":["曾小贤"],"title":"门后的人是？","imageUrl":null,"musicUrl":"zxx","hasKnowledge":"1","knowledgeTipsID":"1"},"knowledgeTips":{"id":"1","image":"1.png","linkType":"news","linkText":"泰坦尼克号沉没背后的的惊天保险诈骗案","url":"http://tv.sohu.com/20101228/n278556355.shtml","title":"小白兔的医药疗效","text":"泰坦尼克号沉没背后的的惊天保险诈骗案你知道么？"}}';*/
            var data = '{"id":3,"level":"1","label":"电视剧","rightanswer":"大长今","achievement":"gtj","feel":"0:-1:1,2:2:2"}';
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
			/*data = '{"id":"1","type":"audio","level":"1","tag":"人物","content":{"inputkeys":"你打的没土小水话上下题白兔来草木宫说","inputwords":["王尼玛","周杰伦","姜太公","爱新觉罗"],"inform":"打一种动物","rightAnswers":["曾小贤"],"title":"门后的人是？","imageUrl":null,"musicUrl":"zxx","hasKnowledge":"1","knowledgeTipsID":"1"},"knowledgeTips":{"id":"1","image":"1.png","linkType":"news","linkText":"泰坦尼克号沉没背后的的惊天保险诈骗案","url":"http://tv.sohu.com/20101228/n278556355.shtml","title":"小白兔的医药疗效","text":"泰坦尼克号沉没背后的的惊天保险诈骗案你知道么？"}}';*/
            data = '{"id":3,"level":"1","label":"电视剧","rightanswer":"大长今","achievement":"gtj"}';
		}
        
    	succeedCallback(JSON.parse(data), context);
	}
}

Problem_Initialize();


