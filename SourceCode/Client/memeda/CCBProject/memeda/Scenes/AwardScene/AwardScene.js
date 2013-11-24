//
// GuessScene class
//

var AwardScene = function() {};
var pThisAwardScene = null;

AwardScene.prototype.showWindow = function () {
    if(sys.os != "android" && sys.os != "Android") {
        if ( RemoteConfig.domob == "1" ) {
            this.duomengCtrl.setVisible(true);
        } else {
            this.duomengCtrl.setVisible(false);
        }
    } else {
        this.duomengCtrl.setVisible(true);
        this.commentCtrl.setVisible(false);
    }

    this.initStatus();
    this.bkgBtn.setVisible(true);
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Begin Timeline");

    if ( !Global_isWeb() ) {
        var param = memeda.Stat.createParam();
        param.addKeyAndValue("question", gProblemProject);

        memeda.Stat.logEvent("showAward", param);
    }
};

AwardScene.prototype.onClickBkg = function () {
    debugMsgOutput("AwardScene.prototype.onClickBkg");
};


AwardScene.prototype.initStatus = function () {
    //
    this.firendCtrl.controller.setItemInfo("UI/floorsscene/award_1.png", 200, this, this.onClickFirend);
    this.commentCtrl.controller.setItemInfo("UI/floorsscene/award_2.png", 200, this, this.onClickComment);
    this.duomengCtrl.controller.setItemInfo("UI/floorsscene/award_3.png", null, this, this.onClickDuomeng);

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

    if(sys.os == "ios")
    {
        // iphone适配
        // 针对非iphone5屏幕做缩小适配
        if(screenHeight / screenWidth < 1136/640)
        {
            this.infoLayout.setScaleX(0.88);
            this.infoLayout.setScaleY(0.88);

            this.infoLayout.setPositionY(-40);
        }
    }
    else
    {
        // android适配
        var scale = (screenHeight/screenWidth) / (568/334);
        if(screenHeight / screenWidth < 1136/640)
        {
            //this.infoLayout.setScaleX(0.88);
            //this.infoLayout.setScaleY(0.88);
            this.infoLayout.setScaleX(scale);
            this.infoLayout.setScaleY(scale);

            this.infoLayout.setPositionY(-((1-scale)*((250/568)*screenHeight)));
        }
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
    var url = Global_getShareUrl(this.aid);
    debugMsgOutput(url);

    if ( !Global_isWeb() ) {
        var param = memeda.Stat.createParam();
        param.addKeyAndValue("question", gProblemProject);

        memeda.Stat.logEvent("clickWeChat", param);
    }

    try
    {
        var shareCallback = new cc.WeChatShareCallBackClass();
        shareCallback.onWechatShareCallback = function (state, errMsg) {
            if ( state == "Success" ) {
                // 分享成功,如果是第一次分享就写配置文件，下次进入场景时提示
                if ( !Global_isWeb() ) {
                    var param = memeda.Stat.createParam();
                    param.addKeyAndValue("question", gProblemProject);
                    memeda.Stat.logEvent("wechatSuccess", param);
                }

                var share = sys.localStorage.getItem("firstshare");
                if ( share == null || share == "" ) {
                    // 第一次分享成功
                    sys.localStorage.setItem("firstshare", "1");
                    sys.localStorage.setItem("showsharecoin", "1");	// 准备显示第一次分享奖励
                    pThisAwardScene.checkWeChat();
                }
            } else if ( state == "Fail" ) {
                if ( !Global_isWeb() ) {
                    var param = memeda.Stat.createParam();
                    param.addKeyAndValue("question", gProblemProject);
                    memeda.Stat.logEvent("wechatFail", param);
                }
                if ( errMsg.indexOf("安装") > 0 ) {
                    pThisAwardScene.wechatError.controller.ShowMsg(errMsg, function () {
                    });
                }
            }
        };

        var socialAPI = cc.SocialShareAPI.getInstance();
        socialAPI.setWeChatShareCallbackTarget(shareCallback);

        socialAPI.shareWeChatURL("对，是窃听！考验耳朵的时候到了","AppIcon40x40@2x.png","一起窃听吧", url,"",false,true);
    } catch (e) {
    }
}

AwardScene.prototype.onClickComment = function (obj) {
    if ( obj.enableAllBtn ) {
        var url_old = "itms-apps://ax.itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?mt=8&onlyLatestVersion=true&pageNumber=0&sortOrdering=1&type=Purple+Software&id=";
        var url_ios6 = "itms-apps://itunes.apple.com/app/id";
        var url = null;
        var system_os_name = sys.localStorage.getItem("system_os_name");
        var system_os_version = sys.localStorage.getItem("system_os_version");

        cc.log("[system_os_name] = "+system_os_name+" [version] = "+system_os_version);
        
        var comment = sys.localStorage.getItem("comment");
        if(system_os_name == "ios")
        {
            if(parseFloat(system_os_version)>=6.0)
            {
                url = url_ios6 + "723564814";
            }
            else
            {
                url = url_old + "723564814";
            }
            cc.log("[open url] = "+url);

            memeda.common.openURL(url);
            
            if ( comment != "1" ) {
            	CoinMgr_Change(200);
            	cc.AudioEngine.getInstance().playEffect("sounds/Click_Pay_Coins.mp3");
            	obj.commentCtrl.controller.setItemStatus(2);
            	sys.localStorage.setItem("comment", "1");	//
            }
        }
    }

    if ( !Global_isWeb() ) {
        var param = memeda.Stat.createParam();
        param.addKeyAndValue("question", gProblemProject);
        memeda.Stat.logEvent("clickComment", param);
    }
}

AwardScene.prototype.onClickDuomeng = function (obj) {
    cc.AudioEngine.getInstance().playEffect("sounds/Click_Wood_OK.mp3");
    if ( obj.enableAllBtn ) {
        debugMsgOutput("memeda.OfferWallController");
        memeda.OfferWallController.show();
    }

    if ( !Global_isWeb() ) {
        var param = memeda.Stat.createParam();
        param.addKeyAndValue("question", gProblemProject);
        memeda.Stat.logEvent("clickDuomeng", param);
    }
}

AwardScene.prototype.checkWeChat = function () {
    var showsharecoin = sys.localStorage.getItem("showsharecoin");
    if ( showsharecoin == "1" ) {
        sys.localStorage.setItem("showsharecoin", "2");	// 准备显示第一次分享奖励
        this.firendCtrl.controller.setItemStatus(2);
        CoinMgr_Change(200);
        cc.AudioEngine.getInstance().playEffect("sounds/Click_Pay_Coins.mp3");
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

    if ( !Global_isWeb() ) {
        var param = memeda.Stat.createParam();
        param.addKeyAndValue("question", gProblemProject);
        memeda.Stat.logEvent("showCoinScene", param);
    }
};
