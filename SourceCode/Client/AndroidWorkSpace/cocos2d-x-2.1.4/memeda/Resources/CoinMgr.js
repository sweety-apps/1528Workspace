var gCoin = 0;
var gRegisterID = 1;
var gEventArr = new Array();
var CoinMgr_gCallBackObj = null;
var gCoinMgr_Init = false;

isWeb = function() {
    try {
        if ( document == null ) {
            return false;
        }
    }catch (e) {
        return false;
    }
	return true;
};

function CoinMgr_Register(fun, context) {
    CoinMgr_Init();
    
	var obj = new Object;
	obj.fun = fun;
	obj.context = context;
	obj.registerID = gRegisterID ++;
    gEventArr.push(obj);
    return obj.registerID;
}

function CoinMgr_Unregister(id) {
    CoinMgr_Init();
    
    for ( var i = 0; i < gEventArr.length; i ++) {
        if ( gEventArr[i].registerID == id ) {
			debugMsgOutput("CoinMgr_Unregister");    	
            gEventArr.remove(i);
            break;
        }
    }
}

function CoinMgr_GetCount() {
    CoinMgr_Init();
    
    return gCoin;
}

function CoinMgr_Change(add) {
    CoinMgr_Init();
    
    var oldCoin = gCoin;
    gCoin += add;
    
	sys.localStorage.setItem("coin", gCoin);
	
    for ( var i = 0; i < gEventArr.length; i ++) {
        (gEventArr[i].fun)(oldCoin, add, gEventArr[i].context);
    }
}

function CoinMgr_Init() {
    if ( gCoinMgr_Init ) {
        return ;
    }
    gCoinMgr_Init = true;
    
    gCoin = sys.localStorage.getItem("coin");
    if ( gCoin == null || gCoin == "" ) {
    	gCoin = 50;
    } else {
        gCoin = parseInt(gCoin);
    }

    if ( !isWeb() ) {
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
}

function CoinMgr_checkExtraCoin(callBackObj) {
    CoinMgr_Init();
    
    CoinMgr_gCallBackObj = callBackObj;

    var time = sys.localStorage.getItem("WechatTime");
    if ( time == "" || time == null ) {
        time = 0;
    }
		
    var now = Math.floor(Date.now() / 1000 / 3600);	// 
    debugMsgOutput("now " + now);
    debugMsgOutput("time " + time);
    debugMsgOutput("---- " + (time - now));
    
    sys.localStorage.setItem("WechatTime", now);
    var http = new XMLHttpRequest();
			
    http.open("GET", "http://memeda.meme-da.com/Stat/WechatAnswerQuery.php?uid=" + Global_getUserID());
    //http.open("GET", "http://memeda.meme-da.com/Stat/WechatAnswerQuery.php?uid=" + Global_getUserID());
    http.onreadystatechange = function(){
        if( http.readyState == 4 && http.status == 200 ) {
            if ( !callBackObj.wachatDidFinish(http.responseText) ) {
                debugMsgOutput("callBackObj.wachatDidFinish");
                memeda.OfferWallController.getInstance().requestOnlinePointCheck();
            } else {
                debugMsgOutput("callBackObj.wachatDidFinish true");
            }
        }
    };
    
    http.send(null);
}