var gGlobalConfig = null;

Global_isWeb = function() {
    try {
        if ( document == null ) {
            return false;
        }
    }catch (e) {
        return false;
    }
	return true;
};

Global_getShareUrl = function (aid) {
	// 	
	if ( aid == null ) {
		var userId = Global_getUserID();
		var param = "uid=" + userId;
		
		return "http://121.197.3.27/memeda.php?" + param;
				
		//return "http://memeda.meme-da.com/memeda.php?" + param;
	} else {
		var userId = Global_getUserID();
		var param = "aid=" + aid + "&uid=" + userId;

		return "http://121.197.3.27/memeda.php?" + param;
		
		//return "http://memeda.meme-da.com/memeda.php?" + param;
	}
};

function S4() {
	return (((1 + Math.random()) * 0x10000)|0).toString(16).substring(1);	
}

function CreateGuid() {
	return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());	
}

Global_getUserID = function () {
	var userId = sys.localStorage.getItem("userid");
	debugMsgOutput(userId);
	if ( userId == "" || userId == null ) {
		userId = CreateGuid();
		
		sys.localStorage.setItem("userid", userId);
		//cc.UserDefault.getInstance().setStringForKey("userid", userId);	
		debugMsgOutput(userId);
	}
	
	return userId;
};

var gQuestionJumpList = null;
var gQuestionJumpEvent = null;
var gQuestionJumpEventID = 0;

Question_init = function () {
	gQuestionJumpList = new Array();
	gQuestionJumpEvent = new Array();
	
	var list = sys.localStorage.getItem("jump");
	debugMsgOutput("jumplist " + list);
	var jumplist = new Array();
	if ( list != null && list != "" ) {
		jumplist = list.split(",");	
	}
	for ( var i = 0; i < jumplist.length; i ++ ) {
		gQuestionJumpList["" + jumplist[i] ] = 1;	
	}
}

Question_isJump = function (aid) {
	if ( gQuestionJumpList["" + aid] == null ) {
		return false;	
	}
	return true;
}

Question_jump = function ( aid ) {
	debugMsgOutput("aid " + aid);
	gQuestionJumpList["" + aid] = 1;
	var strlist = "";
	var i = 0;
	for (var key in gQuestionJumpList) {
		if ( i != 0 ) {
			strlist = strlist + ",";
		}
		i ++;
		strlist = strlist + key;
	}
	
	debugMsgOutput("jumplist write " + strlist);
	sys.localStorage.setItem("jump", strlist);
	
	for ( var i = 0; i < gQuestionJumpEvent.length; i ++ ) {
		(gQuestionJumpEvent[i].fun)(aid, gQuestionJumpEvent[i].content);	
	}
}

Question_registerJumpEvent = function (content, fun) {
	var obj = new object();
	obj.id = gQuestionJumpEventID ++;
	obj.content = content;
	obj.fun = fun;
	gQuestionJumpEvent.push(obj);
}

Question_unregisterJumpEvent = function (cookie) {
	var tmpList = new Array();
	
	for ( var i = 0; i < gQuestionJumpEvent.length; i ++ ) {
		if ( gQuestionJumpEvent[i].id != cookie ) {
			tmpList.push(gQuestionJumpEvent[i]);
		}	
	}
	gQuestionJumpEvent = null;
	gQuestionJumpEvent = tmpList;
}

Question_init();