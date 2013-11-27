var WeChatMsg = function() {};

WeChatMsg.prototype.onClickBkg = function () {
};

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
	
	var share = sys.localStorage.getItem("firstshare");	
	if ( share == null || share == "" ) {
		// 还未分享过
		this.coinImg.setVisible(true);	
		this.num1.setVisible(true);
		this.num2.setVisible(true);
		this.num3.setVisible(true);

		this.title.setVisible(true);
		
		this.btn1.setPositionY(230);
		this.btn2.setPositionY(170);	
		
		this.btnText1.setPositionY(232);
		this.btnText2.setPositionY(172);	
	} else {
		this.coinImg.setVisible(false);
		this.num1.setVisible(false);
		this.num2.setVisible(false);
		this.num3.setVisible(false);

		this.title.setVisible(false);
		this.btn1.setPositionY(297);
		this.btn2.setPositionY(217);
		
		this.btnText1.setPositionY(298);
		this.btnText2.setPositionY(219);
	}
	
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
    if ( !Global_isWeb() ) {
    	var param = memeda.Stat.createParam();
    	param.addKeyAndValue("aid", ""+this.aid);
        param.addKeyAndValue("type", "wechat");
            
    	memeda.Stat.logEvent("clickWechat", param);
    }
	
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
	    
	    socialAPI.shareWeChatURL("我知道你知道我不知道","AppIcon40x40@2x.png","帮我听听这是什么？", url,"",false,false);
    } catch (e) {
    	debugMsgOutput("" + e);
    }
};

WeChatMsg.prototype.onShareFriend = function() {
	// 分享到朋友圈 
    if ( !Global_isWeb() ) {
    	var param = memeda.Stat.createParam();
    	param.addKeyAndValue("aid", ""+this.aid);
        param.addKeyAndValue("type", "firend");
            
    	memeda.Stat.logEvent("clickWechat", param);
    }
    
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
	    
	    socialAPI.shareWeChatURL("我知道你知道我不知道","AppIcon40x40@2x.png","帮我听听这是什么？", url,"",false,true);
    } catch (e) {
    }
};