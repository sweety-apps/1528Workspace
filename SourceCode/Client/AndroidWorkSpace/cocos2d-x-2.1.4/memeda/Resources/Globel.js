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

Global_clearAllGloabalVars = function () {
    gHasShowedUFOLight = false;
};