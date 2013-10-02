var gCoin = 0;
var gRegisterID = 1;
var gEventArr = new Array();
var CoinMgr_gCallBackObj = null;

function CoinMgr_Register(fun, context) {
	var obj = new Object;
	obj.fun = fun;
	obj.context = context;
	obj.registerID = gRegisterID ++;
    gEventArr.push(obj);
    return obj.registerID;
}

function CoinMgr_Unregister(id) {
    for ( var i = 0; i < gEventArr.length; i ++) {
        if ( gEventArr[i].registerID == id ) {
			debugMsgOutput("CoinMgr_Unregister");    	
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
        (gEventArr[i].fun)(oldCoin, add, gEventArr[i].context);
    }
}

function CoinMgr_Init() {
    // 
	sys.localStorage.setItem("coin", 1500);
    gCoin = sys.localStorage.getItem("coin");
    if ( gCoin == null || gCoin == "" ) {
    	gCoin = 50;
    } else {
        gCoin = parseInt(gCoin);
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
    try {
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
			
			http.open("GET", "http://www.liux123.com/Stat/WechatAnswerQuery.php?uid=" + Global_getUserID());		
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
    } catch (e) {
    }
}


CoinMgr_Init();