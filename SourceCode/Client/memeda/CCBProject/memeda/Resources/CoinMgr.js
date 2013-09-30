var gCoin = 0;
var gEventArr = new Array();
var CoinMgr_gCallBackObj = null;

function CoinMgr_Register(fun) {
    gEventArr.push(fun);
}

function CoinMgr_Unregister(fun) {
    for ( var i = 0; i < gEventArr.length; i ++) {
        if ( gEventArr[i] == fun ) {
            gEventArr.remove(i);
            break;
        }
    }
}

function CoinMgr_GetCount() {
    return gCoin;
}

function CoinMgr_Change(add) {
    var oldCoin = gCoin;
    gCoin += add;
    
	sys.localStorage.setItem("coin", gCoin);
	
    for ( var i = 0; i < gEventArr.length; i ++) {
        (gEventArr[i])(oldCoin, add);
    }
}

function CoinMgr_Init() {
    // 
    gCoin = sys.localStorage.getItem("coin");
    if ( gCoin == null ) {
    	gCoin = 50;
    }
    
    memeda.OfferWallController.getInstance().init(Global_getUserID());
    
    memeda.OfferWallController.getInstance().offerWallDidFinishCheck = function (responseText) {
    		if ( CoinMgr_gCallBackObj != null ) {
                debugMsgOutput("aaa" + CoinMgr_gCallBackObj.offerWallDidFinishCheck);
    				CoinMgr_gCallBackObj.offerWallDidFinishCheck(responseText);
    		}
    };
    
    memeda.OfferWallController.getInstance().offerWallDidFinishConsume = function (responseText) {
    		if ( CoinMgr_gCallBackObj != null ) {
    				CoinMgr_gCallBackObj.offerWallDidFinishConsume(responseText);
    		}
    };
    
    memeda.OfferWallController.getInstance().offerWallDidFailCheck = function () {
    		if ( CoinMgr_gCallBackObj != null ) {
    				CoinMgr_gCallBackObj.offerWallDidFailCheck();
    		}
    };
    
    memeda.OfferWallController.getInstance().offerWallDidFailConsume = function (responseText) {
    		if ( CoinMgr_gCallBackObj != null ) {
    				CoinMgr_gCallBackObj.offerWallDidFailConsume(responseText);
    		}
    };
}

function CoinMgr_checkExtraCoin(callBackObj) {
	// 
	//if ( Global_isWeb() ) { // 
	//    return ;	
	//}
    CoinMgr_gCallBackObj = callBackObj;
    
	var time = sys.localStorage.getItem("WechatTime");
	if ( time == "" || time == null ) { 
		time = 0;
	}
	
	var now = Math.floor(Date.now() / 1000 / 3600);	// 
	
	debugMsgOutput(""+now);
	debugMsgOutput(""+time);
	
	if ( Math.abs(time - now) >= 1 ) {
		// ,1
		sys.localStorage.setItem("WechatTime", now);
		var http = new XMLHttpRequest();
		
		http.open("GET", "http://121.197.3.27/Stat/WechatAnswerQuery.php?uid=" + Global_getUserID());		
		//http.open("GET", "http://memeda.meme-da.com/Stat/WechatAnswerQuery.php?uid=" + Global_getUserID());
		http.onreadystatechange = function(){
			if( http.readyState == 4 && http.status == 200 ) {
                gChooseTestsSceneThis.parseWeChatData(http.responseText);
			}
		};
		http.send(null);
			
		debugMsgOutput(http);
	} else {
        // app
        memeda.OfferWallController.getInstance().requestOnlinePointCheck();
    }
}


CoinMgr_Init();