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
    }
};

WeChatMsg.prototype.ShowMsg = function(id, endFun) {
	// 显示购买消息    
	this.aid = id;
	this.maskBkg.setVisible(true);
	this.endFun = endFun;
	
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Begin Timeline");
};

WeChatMsg.prototype.Hide = function() {
	this.rootNode.animationManager.runAnimationsForSequenceNamed("End Timeline");
	this.maskBkg.setVisible(false);
	this.endFun();
};

WeChatMsg.prototype.onClickClose = function() {
	this.Hide();
};

WeChatMsg.prototype.onShare = function() {
	// 分享   
    var url = Global_getShareUrl(this.aid);
    debugMsgOutput(url);
    try
    {
		var shareCallback = new WeChatShareCallBackClass();
	    shareCallback.onWechatShareCallback = function (state, errMsg) {
	        cc.log("share callback!");
	        cc.log("state = " + state + ", errMsg = " + errMsg);
	    };
	    
	    var socialAPI = SocialShareAPI.getInstance();
	    socialAPI.setWeChatShareCallbackTarget(shareCallback);
	    
	    socialAPI.shareWeChatURL("Test","Icon-72.png","testTitle", url,"Description lalala!",false,false);
    } catch (e) {
    }
    
	this.Hide();	
};

WeChatMsg.prototype.onShareFriend = function() {
	// 分享到朋友圈 
    var url = Global_getShareUrl(this.aid);
    debugMsgOutput(url);
    
    try 
    {
		var shareCallback = new WeChatShareCallBackClass();
	    shareCallback.onWechatShareCallback = function (state, errMsg) {
	        cc.log("share callback!");
	        cc.log("state = " + state + ", errMsg = " + errMsg);
	    };
	    
	    var socialAPI = SocialShareAPI.getInstance();
	    socialAPI.setWeChatShareCallbackTarget(shareCallback);
	    
	    socialAPI.shareWeChatURL("Test","Icon-72.png","testTitle", url,"Description lalala!",false,true);
    } catch (e) {
    }
    
	this.Hide();	
};