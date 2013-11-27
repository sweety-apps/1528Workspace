//
// ChooseTestsScene class
//

var kDisableBounceOffsetY = 40;
var kBuyMessageBoxShowOffsetToTop = 480;

//弹出框状态
var kBuyMessageBoxStateHidden = 0;
var kBuyMessageBoxStateClosedInTopRange = 1;
var kBuyMessageBoxStateShowing = 2;

//场景状态
var kFloorsSceneStateNormal = 0;
var kFloorsSceneStateEnteringDoor = 1;

var kScrollingStateNormal = 0;
var kScrollingStateReachedBoxShowOffset = 1;
var gChooseTestsSceneThis = null;

var kFloorsSceneTopStateHidden = 0;
var kFloorsSceneTopStateShow = 1;

var ChooseTestsScene = function() {
};

ChooseTestsScene.prototype.sceneState = kFloorsSceneStateNormal;
ChooseTestsScene.prototype.topState = kFloorsSceneTopStateHidden;
ChooseTestsScene.prototype.topSceneHeight = 568;

ChooseTestsScene.prototype.onDidLoadFromCCB = function () {
    if ( gPreload ) {
        return ;
    }

    //cc.SpriteFrameCache.getInstance().addSpriteFrames("UI/firstscene.plist");
    //cc.SpriteFrameCache.getInstance().addSpriteFrames("UI/common.plist");
    //cc.SpriteFrameCache.getInstance().addSpriteFrames("UI/buy_coin_msgbox.plist");
    //cc.SpriteFrameCache.getInstance().addSpriteFrames("UI/floors_bg.plist");
    //cc.SpriteFrameCache.getInstance().addSpriteFrames("UI/floors_doors.plist");
    //cc.SpriteFrameCache.getInstance().addSpriteFrames("UI/floorsscene.plist");
    
    Key_setCurrentScene(this);
    
    gChooseTestsSceneThis = this;

    this.isShowScene = true;
	this.isQuery = false;
	
    // 设备上面需要开启触摸
    if( 'touches' in sys.capabilities )
        this.rootNode.setTouchEnabled(true);

    // Start playing looped background music
    //if ( !Global_isWeb() ) {
    cc.AudioEngine.getInstance().playMusic("sounds/Floor_BG.mp3",true);
    cc.AudioEngine.getInstance().setMusicVolume(0.5);
    //}

    // 重新设置楼顶高度
    var screenSize = cc.Director.getInstance().getWinSize();
    var screenHeight = screenSize.width > screenSize.height ? screenSize.width : screenSize.height;
    var topSceneHeight = (screenHeight - 29);
    this.topSceneHeight = topSceneHeight;

    //
    this.floorScrollView.setDelegate(this);
    this.wholeFloors = this.floorScrollView.getContainer();
    //debugMsgOutput(this.wholeFloors.getPositionX() + this.wholeFloors.getPositionY());
    this.scrollViewDidScroll(this.floorScrollView);
    this.wholeFloors.controller.setDoorPressedCallback(this,this.onPressedDoor);
    this.wholeFloors.controller.setScrollingCallback(this,this.onScrollDoorToPresent);

    //设置状态
    this.wholeFloors.scrollState = kScrollingStateNormal;
    this.topState = kFloorsSceneTopStateHidden;

    //设置场景状态
    this.sceneState = kFloorsSceneStateNormal;
    this.rootNode.animationManager.setCompletedAnimationCallback(this, this.onAnimationCompleted);

    // 购买按钮
    this.coinCtrl.controller.registerBuyEvent(this, this.onClickedCoinButton);

    // 初始化多盟
    if ( !Global_isWeb() ) {
        debugMsgOutput("" + memeda.OfferWallController);
        memeda.OfferWallController.init(Global_getUserID());
    }
    
    this.wholeFloors.controller.setupCatPosition();
    this.scrollFloorsToCatPosition();


    var imageUrl = "UI/floors_doors/"+ "ToolbarBG" + ".png";
    //var spriteFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame(imageUrl);
    //this.toolBarSprite.setSpriteFrame(spriteFrame);
    //UtilsFunctions_setScale9SpriteImageWithName(this.toolBarSprite,imageUrl);

    this.answeredPercentsLbl.setString(""+Problem_getRightAnswersPercents()+"%");

    this.cloudCCB.animationManager.runAnimationsForSequenceNamed("Default Timeline");
    //this.cloudCCB.animationManager.setCompletedAnimationCallback(this,this.onCloudsCCBFinishedAnimation);

    //UFO 光线地震动画
    this.wholeFloors.controller.onUFOLightAnimationCompletedCallbackTarget = this;
    this.wholeFloors.controller.onUFOLightAnimationCompletedCallbackFunc = this.doShakeFloorsAnimation;
    
    this.QueryExtraCoin();
    cc.Director.getInstance().getScheduler().scheduleUpdateForTarget(this, 0, !this._isRunning);
};

ChooseTestsScene.prototype.doShakeFloorsAnimation = function() {
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Shake Timeline");
};

ChooseTestsScene.prototype.scrollViewDidZoom = function (scrollView)
{
    debugMsgOutput("scroll zooming!");
    //this.bgScape
};

ChooseTestsScene.prototype.updateBuyMsgBoxState = function ()
{
    var scrollView = this.floorScrollView;
    var containerHeight = scrollView.getContentSize().height;
    var scrolledY = scrollView.getContentOffset().y;
    var scrollViewHeight = scrollView.getViewSize().height;
    var scrolledPercent = scrolledY / (containerHeight - scrollViewHeight);
    var bgScrolledOffset = (this.bgScape.getContentSize().height - scrollViewHeight) * scrolledPercent;

    debugMsgOutput(""+containerHeight - scrollViewHeight - Math.abs(scrolledY));
    if(containerHeight - scrollViewHeight - Math.abs(scrolledY) < kBuyMessageBoxShowOffsetToTop)
    {
        this.wholeFloors.scrollState = kScrollingStateReachedBoxShowOffset;
    }
    else
    {
        this.wholeFloors.scrollState = kScrollingStateNormal;
    }
}

ChooseTestsScene.prototype.scrollViewDidScroll = function (scrollView)
{
    var containerHeight = scrollView.getContentSize().height - this.topSceneHeight;
    var scrolledY = scrollView.getContentOffset().y;
    var scrollViewHeight = scrollView.getViewSize().height;
    var scrolledPercent = scrolledY / (containerHeight - scrollViewHeight);
    var bgScapeHeight = this.bgScape.getContentSize().height;
    var bgScrolledOffset = (bgScapeHeight - scrollViewHeight) * scrolledPercent;

    this.updateBuyMsgBoxState();

    //手动将bounce disable掉，保证加速度滑动和非bounce兼容
    if(Math.abs(scrolledY) < kDisableBounceOffsetY || (containerHeight + this.topSceneHeight - scrollViewHeight) - Math.abs(scrolledY) < kDisableBounceOffsetY)
    {
        scrollView.setBounceable(false);
        //如果滑到顶了，展示楼顶动画
        if(this.topState == kFloorsSceneTopStateHidden && (containerHeight + this.topSceneHeight - scrollViewHeight) - Math.abs(scrolledY) < 1)
        {
            this.topState = kFloorsSceneTopStateShow;
            this.wholeFloors.controller.showFloorsTopAnimation();
        }
    }
    else
    {
        scrollView.setBounceable(true);
    }

    if(scrolledPercent < -1.0)
    {
        debugMsgOutput("scroll over bgScape");
        bgScrolledOffset = -bgScapeHeight + containerHeight + scrolledY;
    }

    this.bgScape.setPositionY(bgScrolledOffset);
    this.wholeFloors.controller.UpdateWholeFloors(scrollView);

    debugMsgOutput("scrolled = " + scrolledPercent + " ,BG Off = " + bgScrolledOffset);
};

ChooseTestsScene.prototype.onPressedStartPlay = function()
{
    var floorNum = this.wholeFloors.controller.getCatStayAtFloorNum();
    var doorNum = this.wholeFloors.controller.getCatStayAtDoorNum();
    cc.AudioEngine.getInstance().playEffect("sounds/Click_Wood_OK.mp3");

    try {
        cc.AudioEngine.getInstance().setMusicVolume(0.0);
        cc.AudioEngine.getInstance().stopMusic();
    }catch ( e ) {
    }

    var color = GetColorByFloor(floorNum, doorNum-1);
    GuessScene_SetFloorInfo(floorNum*3 + (doorNum - 1), 1, color);

    var scene = cc.BuilderReader.loadAsScene("GuessScene.ccbi");
    scene = cc.TransitionProgressInOut.create(0.2,scene);

    this.isShowScene = false;
    cc.Director.getInstance().getScheduler().unscheduleUpdateForTarget(this);
    cc.Director.getInstance().replaceScene(scene);
};

ChooseTestsScene.prototype.onPressedAwardButton = function()
{
    // 显示奖励界面
    if(!SpecialSpyPackageMgr_IsPurchased())
    {
        this.showBuyMessageBox();
    }
};

ChooseTestsScene.prototype.onAnimationCompleted = function()
{
    if(this.sceneState == kFloorsSceneStateEnteringDoor && this.rootNode.animationManager.getLastCompletedSequenceName() == "Enter Door Timeline")
    {
        try {
            cc.AudioEngine.getInstance().setMusicVolume(0.0);
            cc.AudioEngine.getInstance().stopMusic();
        }catch ( e ) {
        }

        this.sceneState = kFloorsSceneStateNormal;
        var scene = cc.BuilderReader.loadAsScene("GuessScene.ccbi");
        scene = cc.TransitionProgressInOut.create(0.2,scene);

        this.isShowScene = false;
        cc.Director.getInstance().getScheduler().unscheduleUpdateForTarget(this);
        cc.Director.getInstance().replaceScene(scene);
    }
    if(this.rootNode.animationManager.getLastCompletedSequenceName() == "Loop Timeline")
    {
        //修正云循环一遍就不动的BUG
        cc.log("[Animation] Loop Timeline Finished!")
        this.cloudCCB.animationManager.runAnimationsForSequenceNamed("Default Timeline");
    }
};

ChooseTestsScene.prototype.onPressedDoor = function (isDoorOpened, floorNum, doorNum)
{
    if(isDoorOpened)
    {
        if(this.sceneState == kFloorsSceneStateNormal)
        {
            this.sceneState = kFloorsSceneStateEnteringDoor;

            var color = GetColorByFloor(floorNum, doorNum-1);
            GuessScene_SetFloorInfo(floorNum*3 + (doorNum - 1), 2, color);

            this.rootNode.animationManager.runAnimationsForSequenceNamed("Enter Door Timeline");
        }
    }
    else
    {
        this.onPressedAwardButton();
    }
};

ChooseTestsScene.prototype.onScrollDoorToPresent = function (isDoorOpened, floorNum, doorNum)
{
    if(isDoorOpened)
    {
        var scrollFloorHeight = this.rootNode.getContentSize().height;
        var scrollOffsetX = this.wholeFloors.controller.floorRect.x;
        //var scrollOffsetY = -(this.wholeFloors.controller.floorHeight * floorNum);
        var scrollOffsetY = -((this.wholeFloors.controller.startFloorOffsetY*3) + (this.wholeFloors.controller.floorHeight * floorNum));
        /*
         if(scrollOffsetY > 0)
         {
         scrollOffsetY = 0;
         }
         */
        scrollOffsetY += scrollFloorHeight/2;
        cc.log("\<\> scrolling to Y = "+scrollOffsetY + ", sceneHeight = "+scrollFloorHeight);

        //this.floorScrollView.setContentOffset(cc.p(0,0),true);
        this.floorScrollView.setContentOffset(cc.p(scrollOffsetX,scrollOffsetY),true);
    }
};

ChooseTestsScene.prototype.testsFinishedPercent = 5;

ChooseTestsScene.prototype.onClickedBuySpyPackageButton = function () {
    // 打开金币购买界面
    debugMsgOutput("[UI Event] Clicked Buy Spy Package Button!");
    if ( this.buyCoinMsgBox == null ) {
        this.buyCoinMsgBox = cc.BuilderReader.load("BuyCoinMessageBox");
        this.ccbLayout.addChild( this.buyCoinMsgBox );
    }

    this.buyCoinMsgBox.controller.hiddenCallbackTarget = this;
    this.buyCoinMsgBox.controller.hiddenCallbackMethod = function(productID,succeed) {
        if(succeed)
        {
            //todo
        }
    };
    this.buyCoinMsgBox.controller.showAndBuyItem("6元侦探礼包",Purchase_getSpyPackageProductID());
};

ChooseTestsScene.prototype.showBuyMessageBox = function()
{

};

ChooseTestsScene.prototype.onMsgboxAnimationCompleted = function()
{
    this.updateBuyMsgBoxState();
};

ChooseTestsScene.prototype.onPressedAward = function () {
    // 打开领取奖励界面
    cc.AudioEngine.getInstance().playEffect("sounds/Click_Coins.mp3");
    if ( this.awardScene == null ) {
        if ( sys.os != "android" && sys.os != "Android" ) {
            this.awardScene = cc.BuilderReader.load("AwardScene");
        } else {
            this.awardScene = cc.BuilderReader.load("AwardSceneForAndroid");
        }

        this.ccbLayout2.addChild(this.awardScene);
        this.awardScene.controller.attachClickBuyEvent(this, this.onClickedCoinButton);
    }
    this.awardScene.controller.showWindow();
    //var scene = cc.BuilderReader.loadAsScene("AwardScene.ccbi");
    //cc.Director.getInstance().replaceScene(scene);
};

ChooseTestsScene.prototype.onClickedCoinButton = function (obj) {
    // 打开金币购买界面
    if ( sys.os == "android" || sys.os == "Android" ) {
        try {
            if(cc.AudioEngine.getInstance().isMusicPlaying()) {
                cc.AudioEngine.getInstance().stopMusic();
                cc.AudioEngine.getInstance().setMusicVolume(0.0);
            }
        } catch (e) {
        }

        memeda.Stat.logEvent("offerwellfromfloor");

        cc.AudioEngine.getInstance().playEffect("sounds/Click_Wood_OK.mp3");
        memeda.OfferWallController.show();
    } else {
        debugMsgOutput("[UI Event] Clicked Coin Button!");
        if ( obj.buyCoinMsgBox == null ) {
            obj.buyCoinMsgBox = cc.BuilderReader.load("BuyCoinMessageBox");
            obj.ccbLayout.addChild( obj.buyCoinMsgBox );
        }

        obj.buyCoinMsgBox.controller.show();
    }
};

ChooseTestsScene.prototype.QueryExtraCoin = function () {
    debugMsgOutput("gChooseTestsSceneThis.isQuery " + gChooseTestsSceneThis.isQuery);
	if ( gChooseTestsSceneThis.isQuery ) {
		return ;
	}
	
	gChooseTestsSceneThis.isQuery = true;
    var callBackObj = new Object();
    callBackObj.wachatDidFinish = this.parseWeChatData;

    callBackObj.offerWallDidFinishCheck = function(responseText) {
        debugMsgOutput("offerWallDidFinishCheck " + responseText);
        // 请求到来自多盟的数据
        gChooseTestsSceneThis.parseOfferWallData(responseText);
    };
    callBackObj.offerWallDidFinishConsume = function(responseText) {
        debugMsgOutput("offerWallDidFinishConsume " + responseText);
    };
    callBackObj.offerWallDidFailCheck = function() {
        gChooseTestsSceneThis.isQuery = false;
        debugMsgOutput("offerWallDidFailCheck");
    };
    callBackObj.offerWallDidFailConsume = function() {
        debugMsgOutput("offerWallDidFailConsume");
    };
    callBackObj.spendPoints = function(responseText) {
    };
    callBackObj.windowClosed = function() {
    	debugMsgOutput("callBackObj.windowClosed");
    	gChooseTestsSceneThis.QueryExtraCoin();	
    };
    
    CoinMgr_checkExtraCoin(callBackObj);  // 检测额外的金币奖励，包括微信和多盟
    debugMsgOutput("-0-=-=-=-=-=");
};


ChooseTestsScene.prototype.parseWeChatData = function (text) {
    debugMsgOutput("---" + text);
    var obj = JSON.parse(text);
    debugMsgOutput("count : " + obj.list.length);
    if ( obj == null || obj.list == null || obj.list.length == 0 ) {
        return false;
    }

    var num = 0;
    for (var i = 0; i < obj.list.length; i ++ ) {
        num += obj.list[i].num;
    }

    if ( num != 0 ) {
        // 来自微信的奖励
        if ( num > 199 ) {
            num = 199;
        }
        if ( gChooseTestsSceneThis.weChatAwardMsg == null ) {
            gChooseTestsSceneThis.weChatAwardMsg = cc.BuilderReader.load("WechatAwardMsg");
            gChooseTestsSceneThis.weChatAwardMsgLayout.addChild( gChooseTestsSceneThis.weChatAwardMsg );
        }
        debugMsgOutput("fsjflsdkjfklsdf");
        gChooseTestsSceneThis.weChatAwardMsg.controller.ShowMsg(1, num * 5, function (coin) {
            CoinMgr_Change(coin);
        });

        return true;
    }
    return false;
};

ChooseTestsScene.prototype.parseOfferWallData = function (responseText) {
    if ( sys.os == "android" || sys.os == "Android" ) {
        var obj = JSON.parse(responseText);
        if ( obj.Point > 0 ) {
            // 有可消费的积分
            if ( this.weChatAwardMsg == null ) {
                this.weChatAwardMsg = cc.BuilderReader.load("WechatAwardMsg");
                this.weChatAwardMsgLayout.addChild( this.weChatAwardMsg );
            }

            this.weChatAwardMsg.controller.ShowMsg(2, obj.Point, function (coin) {
                // 消费掉多余的金币
                CoinMgr_Change(coin);
            });
        }
    } else {
        if ( !this.isShowScene ) {
            gChooseTestsSceneThis.isQuery = false;
            return ;
        }

        var obj = JSON.parse(responseText);
        var consumed = sys.localStorage.getItem("consumed");
        // 消费掉的积分，取本地和服务器上纪录的最大值
        debugMsgOutput("obj.totalPoint " + obj.totalPoint);
        debugMsgOutput("obj.consumed " + obj.consumed);
        debugMsgOutput("consumed " + consumed);

        if ( consumed != null && consumed != "" ) {
            consumed = parseInt(consumed);
            if ( consumed < obj.consumed ) {
                consumed = obj.consumed;
            }
        }

        var canConsum = obj.totalPoint - consumed;
        if ( canConsum > 990 ) {
            canConsum = 990;
        }
        if ( obj.totalPoint > consumed ) {
            // 有金币可以消费
            if ( this.weChatAwardMsg == null ) {
                this.weChatAwardMsg = cc.BuilderReader.load("WechatAwardMsg");
                this.weChatAwardMsgLayout.addChild( this.weChatAwardMsg );
            }

            this.weChatAwardMsg.controller.ShowMsg(2, canConsum, function (coin) {
                sys.localStorage.setItem("consumed", obj.totalPoint); // 保存本地数据
                // 消费掉多余的金币
                memeda.OfferWallController.getInstance().requestOnlineConsumeWithPoint(obj.totalPoint - obj.consumed);
                CoinMgr_Change(coin);
                gChooseTestsSceneThis.isQuery = false;
            });
        } else {
            gChooseTestsSceneThis.isQuery = false;
        }
    }
};

ChooseTestsScene.prototype.scrollFloorsToCatPosition = function ()
{
    var scrollX = this.floorScrollView.getContentOffset().x;
    var scrollY = this.wholeFloors.controller.getShouldScrollToY(this.rootNode.getContentSize().height);
    //答完了，华到顶并展示动画
    if(this.wholeFloors.controller.isCatStayAtLastDoor() && this.topState == kFloorsSceneTopStateHidden)
    {
        var wholeFloorsHeight = this.floorScrollView.getContentSize().height;
        var scrollViewHeight = this.floorScrollView.getViewSize().height;
        scrollY = -(wholeFloorsHeight - scrollViewHeight);
        this.topState = kFloorsSceneTopStateShow;
        this.wholeFloors.controller.showPreFloorsTopAnimation();
    }
    this.floorScrollView.setContentOffset(cc.p(scrollX,scrollY),false);

};


ChooseTestsScene.prototype.update = function() {
    if ( this.isShowScene ) {
        if ( this.gTimeCount == null ) {
            this.gTimeCount = 0;
        }
        
        this.gTimeCount ++;
        if ( this.gTimeCount == 60 ) {
            if ( sys.localStorage.getItem("enterforeground") == "1" ) {
                sys.localStorage.setItem("enterforeground", "0");
                this.QueryExtraCoin();
            }
            this.gTimeCount = 0;
        }
    }
}

ChooseTestsScene.prototype._isRunning = function () {
    return true;
}

ChooseTestsScene.prototype.Key_onBackClicked = function() {
	if ( this.awardScene != null && this.awardScene.controller.show ) {
		this.awardScene.controller.onBack();
	} else {
    	var scene = cc.BuilderReader.loadAsScene("FirstScene.ccbi");
    	scene = cc.TransitionProgressInOut.create(0.2,scene);

    	this.isShowScene = false;
    	cc.Director.getInstance().getScheduler().unscheduleUpdateForTarget(this);
    	cc.Director.getInstance().replaceScene(scene);
	}
};