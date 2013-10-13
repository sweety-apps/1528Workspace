var WeChatMsg = function() {};


WeChatMsg.prototype.onDidLoadFromCCB = function () {
    // Do Scale
    var screenSize = cc.Director.getInstance().getWinSizeInPixels();
    var screenWidth = screenSize.width > screenSize.height ? screenSize.height : screenSize.width;
    var screenHeight = screenSize.width > screenSize.height ? screenSize.width : screenSize.height;

    // 针对非iphone5屏幕做缩小适配
    if(screenHeight / screenWidth < 1136/640)
    {   
        this.msgLayout.setScaleX(0.84);
        this.msgLayout.setScaleY(0.84);
        
        this.msgLayout.setPositionY(-50);
    }
};

WeChatMsg.prototype.ShowMsg = function(id, endFun, sharedFun) { 
	this.aid = id;
	this.maskBkg.setVisible(true);
	this.endFun = endFun;
	this.sharedFun = sharedFun;
	this.errMsg = null;
	
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Begin Timeline");
};

WeChatMsg.prototype.Hide = function() {
	this.rootNode.animationManager.runAnimationsForSequenceNamed("End Timeline");
	this.maskBkg.setVisible(false);
	this.endFun(this.errMsg);
};

WeChatMsg.prototype.onClickClose = function() {
	this.Hide();
};

WeChatMsg.prototype.onShare = function() {
	// 分享   
    var url = Global_getShareUrl(this.aid);
    debugMsgOutput(url);
    
    var This = this;
    try
    {
		var shareCallback = new cc.WeChatShareCallBackClass();
	    shareCallback.onWechatShareCallback = function (state, errMsg) {
	    	if ( state == "Success" ) {
	    		This.Hide();	
	    		// 分享成功,如果是第一次分享就写配置文件，下次进入场景时提示
	    		var share = sys.localStorage.getItem("firstshare");	
	    		if ( share == null || share == "" ) {
	    			// 第一次分享成功
	    			sys.localStorage.setItem("firstshare", "1");	
	    			sys.localStorage.setItem("showsharecoin", "1");	// 准备显示第一次分享奖励
	    			This.sharedFun();
	    		}
	    	} else if ( state == "Fail" ) {
	    		This.errMsg = errMsg;	
	    		This.Hide();
	    	}
	    };
	    
	    var socialAPI = cc.SocialShareAPI.getInstance();
	    socialAPI.setWeChatShareCallbackTarget(shareCallback);
	    
	    socialAPI.shareWeChatURL("Test","Icon-72.png","testTitle", url,"Description lalala!",false,false);
    } catch (e) {
    	debugMsgOutput("" + e);
    }
};

WeChatMsg.prototype.onShareFriend = function() {
	// 分享到朋友圈 
    var url = Global_getShareUrl(this.aid);
    debugMsgOutput(url);
    
    var This = this;
    try 
    {
		var shareCallback = new cc.WeChatShareCallBackClass();
	    shareCallback.onWechatShareCallback = function (state, errMsg) {
	    	if ( state == "Success" ) {
	    		This.Hide();
	    		// 分享成功,如果是第一次分享就写配置文件，下次进入场景时提示
	    		var share = sys.localStorage.getItem("firstshare");	
	    		if ( share == null || share == "" ) {
	    			// 第一次分享成功
	    			sys.localStorage.setItem("firstshare", "1");	
	    			sys.localStorage.setItem("showsharecoin", "1");	// 准备显示第一次分享奖励
	    			This.sharedFun();
	    		}
	    	} else if ( state == "Fail" ) {
	    		This.errMsg = errMsg;	
	    		This.Hide();
	    	}
	    };
	    
	    var socialAPI = cc.SocialShareAPI.getInstance();
	    socialAPI.setWeChatShareCallbackTarget(shareCallback);
	    
	    socialAPI.shareWeChatURL("Test","Icon-72.png","testTitle", url,"Description lalala!",false,true);
    } catch (e) {
    }
};