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
		// 223.4.33.112/memeda
		//return "http://223.4.33.112/memeda/index.html?" + param;
		return "http://192.168.198.100:54321/index.html?" + param;
		//return "http://localhost:54321/index.html?" + param;		
	} else {
		var userId = Global_getUserID();
		var param = "aid=" + aid + "&uid=" + userId;
		// 223.4.33.112/memeda
		//return "http://223.4.33.112/memeda/index.html??" + param;
		return "http://192.168.198.100:54321/index.html?" + param;
		//return "http://localhost:54321/index.html?" + param;
	}
};

function S4() {
	return (((1 + Math.random()) * 0x10000)|0).toString(16).substring(1);	
}

function CreateGuid() {
	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" +S4() + "-" + S4() + S4() + S4());	
}

Global_getUserID = function () {
	var userId = sys.localStorage.getItem("userid");
	debugMsgOutput(userId);
	if ( userId == "" ) {
		userId = CreateGuid();
		
		sys.localStorage.setItem("userid", userId);
		//cc.UserDefault.getInstance().setStringForKey("userid", userId);	
		debugMsgOutput(userId);
	}
	
	return userId;
};