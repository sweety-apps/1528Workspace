//
// GuessScene class
//

var AwardScene = function() {};
var pThisAwardScene = null;

AwardScene.prototype.showWindow = function () {
	this.initStatus();
	this.bkgBtn.setVisible(true);
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Begin Timeline");
};

AwardScene.prototype.onClickBkg = function () {
	debugMsgOutput("AwardScene.prototype.onClickBkg");
};


AwardScene.prototype.initStatus = function () {
    //
    this.firendCtrl.controller.setItemInfo("UI/guess/award_1.png", 500, this, this.onClickFirend);
    this.commentCtrl.controller.setItemInfo("UI/guess/award_2.png", 543, this, this.onClickComment);
    this.duomengCtrl.controller.setItemInfo("UI/guess/award_3.png", null, this, this.onClickDuomeng);
    
    var showsharecoin = sys.localStorage.getItem("showsharecoin");
    if ( showsharecoin == "2" ) {
    	this.firendCtrl.controller.setItemStatus(2);
    } else {
    	this.firendCtrl.controller.setItemStatus(1);
    }
    
    var comment = sys.localStorage.getItem("comment");	//
    if ( comment == "1" ) {
    	this.commentCtrl.controller.setItemStatus(2);
    } else {
     	this.commentCtrl.controller.setItemStatus(1);
    }
    
    this.duomengCtrl.controller.setItemStatus(0);
}

AwardScene.prototype.onDidLoadFromCCB = function () {
	pThisAwardScene = this;
	this.enableAllBtn = true;
	
    if( 'touches' in sys.capabilities )
        this.rootNode.setTouchEnabled(true);
    
	this.coinCtrl.controller.registerBuyEvent(this, this.onClickedCoinButton);
    
    this.initStatus();
    
    // Do Scale
    var screenSize = cc.Director.getInstance().getWinSizeInPixels();
    var screenWidth = screenSize.width > screenSize.height ? screenSize.height : screenSize.width;
    var screenHeight = screenSize.width > screenSize.height ? screenSize.width : screenSize.height;
    
    // 针对非iphone5屏幕做缩小适配
    if(screenHeight / screenWidth < 1136/640)
    {
        this.infoLayout.setScaleX(0.88);
        this.infoLayout.setScaleY(0.88);
        
        this.infoLayout.setPositionY(-40);
    }
};

AwardScene.prototype.onBack = function () {
	if ( this.enableAllBtn  ) {
		cc.AudioEngine.getInstance().playEffect("sounds/Click_Wood_Cancel.mp3");
        
		this.bkgBtn.setVisible(false);
		this.rootNode.animationManager.runAnimationsForSequenceNamed("End Timeline");
    	//var scene = cc.BuilderReader.loadAsScene("ChooseTestsScene.ccbi");
    	//cc.Director.getInstance().replaceScene(scene);
	}
};

AwardScene.prototype.onClickFirend = function (obj) {
	if ( obj.enableAllBtn ) {
		obj.enableAllBtn = false;
		obj.weChatMsg.controller.ShowMsg(null, function () {
                                         obj.enableAllBtn = true;
                                         },
                                         function () {
                                         pThisAwardScene.checkWeChat();
                                         });
	}
}

AwardScene.prototype.onClickComment = function (obj) {
	if ( obj.enableAllBtn ) {
		var url = "itms-apps://ax.itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?mt=8&onlyLatestVersion=true&pageNumber=0&sortOrdering=1&type=Purple+Software&id=";
		url = url + "1234567890";
		memeda.common.openURL(url);
		CoinMgr_Change(543);
		obj.commentCtrl.controller.setItemStatus(2);
		sys.localStorage.setItem("comment", "1");	//
	}
}

AwardScene.prototype.onClickDuomeng = function (obj) {
    cc.AudioEngine.getInstance().playEffect("sounds/Click_Wood_OK.mp3");
	if ( obj.enableAllBtn ) {
		debugMsgOutput("memeda.OfferWallController");
		memeda.OfferWallController.show();
	}
}

AwardScene.prototype.checkWeChat = function () {
	var showsharecoin = sys.localStorage.getItem("showsharecoin");
	if ( showsharecoin == "1" ) {
		sys.localStorage.setItem("showsharecoin", "2");	// 准备显示第一次分享奖励
    	this.firendCtrl.controller.setItemStatus(2);
		CoinMgr_Change(500);
	}
}

AwardScene.prototype.attachClickBuyEvent = function (context, clickFun) {
	this.context = context;
	this.clickFun = clickFun;
}

AwardScene.prototype.onClickedCoinButton = function (obj) {
    // 打开金币购买界面
	if ( obj.enableAllBtn ) {
    	debugMsgOutput("[UI Event] Clicked Coin Button!");
    	(obj.clickFun)(obj.context);
	}
};
