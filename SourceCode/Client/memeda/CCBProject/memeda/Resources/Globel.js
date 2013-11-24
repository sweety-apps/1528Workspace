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
		
		return "http://memeda.meme-da.com/memeda.php?" + param;
	} else {
		var userId = Global_getUserID();
		var param = "aid=" + aid + "&uid=" + userId;

		return "http://memeda.meme-da.com/memeda.php?" + param;
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

var RemoteConfig = new Object;

Global_InitRemoteConfig = function () {
    RemoteConfig.alipay = "0";
    RemoteConfig.domob = sys.localStorage.getItem("openDomob");
    if ( RemoteConfig.domob == "" || RemoteConfig.domob == null ) {
    	RemoteConfig.domob = "0";	
    }
    
    var http = new XMLHttpRequest();
    http.open("GET", "http://memeda.meme-da.com/ServiceConfig2.php?id=" + CreateGuid());
    
    http.onreadystatechange = function(){
        if( http.readyState == 4 && http.status == 200 ) {
            debugMsgOutput(http.responseText);
            var obj = JSON.parse(http.responseText);
        
            RemoteConfig = obj;
            if ( RemoteConfig.alipay != "0" && RemoteConfig.alipay != "1" ) {
                RemoteConfig.alipay = "0";
            }
            if ( RemoteConfig.domob != "0" && RemoteConfig.domob != "1" ) {
                RemoteConfig.domob = "0";
            }
            
            sys.localStorage.setItem("openDomob", RemoteConfig.domob);
        } else {
        	
        }
    }
    http.send(null);
}

Global_InitRemoteConfig();