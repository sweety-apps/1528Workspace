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

var ChooseTestsScene = function() {
};

ChooseTestsScene.prototype.sceneState = kFloorsSceneStateNormal;

ChooseTestsScene.prototype.onDidLoadFromCCB = function () {
	gChooseTestsSceneThis = this;
	
    // 设备上面需要开启触摸
    if( 'touches' in sys.capabilities )
        this.rootNode.setTouchEnabled(true);

    // Start playing looped background music
    if ( !Global_isWeb() ) {
    	cc.AudioEngine.getInstance().playMusic("sounds/CAT_FIGHT_BG.mp3",true);
    	cc.AudioEngine.getInstance().setMusicVolume(0.5);
    }
    
    this.floorScrollView.setDelegate(this);
    this.wholeFloors = this.floorScrollView.getContainer();
    //debugMsgOutput(this.wholeFloors.getPositionX() + this.wholeFloors.getPositionY());
    this.scrollViewDidScroll(this.floorScrollView);
    this.wholeFloors.controller.setDoorPressedCallback(this,this.onPressedDoor);
    this.wholeFloors.controller.setScrollingCallback(this,this.onScrollDoorToPresent);

    //设置状态
    this.buyMsgBox.showState = kBuyMessageBoxStateHidden;
    this.wholeFloors.scrollState = kScrollingStateNormal;
    this.buyMsgBox.animationManager.setCompletedAnimationCallback(this, this.onMsgboxAnimationCompleted);

    //设置场景状态
    this.sceneState = kFloorsSceneStateNormal;
    this.rootNode.animationManager.setCompletedAnimationCallback(this, this.onAnimationCompleted);
    
    this.checkWechatShared();
    
    this.coinNumber.setString("" + CoinMgr_GetCount());
    CoinMgr_Register(function (coin, add) {
        gChooseTestsSceneThis.coinNumber.setString("" + CoinMgr_GetCount());
    });
    
    // 初始化多盟
    if(!Global_isWeb())
    {
        debugMsgOutput("" + memeda.OfferWallController);
        memeda.OfferWallController.init();
    }
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

    if(this.wholeFloors.scrollState == kScrollingStateReachedBoxShowOffset && this.buyMsgBox.showState == kBuyMessageBoxStateHidden)
    {
        this.showBuyMessageBox();
    }

    if(this.buyMsgBox.showState != kBuyMessageBoxStateShowing)
    {
        if(this.wholeFloors.scrollState == kScrollingStateReachedBoxShowOffset)
        {
            this.buyMsgBox.showState = kBuyMessageBoxStateClosedInTopRange;
        }
        else
        {
            this.buyMsgBox.showState = kBuyMessageBoxStateHidden;
        }
    }
}

ChooseTestsScene.prototype.scrollViewDidScroll = function (scrollView)
{
    var containerHeight = scrollView.getContentSize().height;
    var scrolledY = scrollView.getContentOffset().y;
    var scrollViewHeight = scrollView.getViewSize().height;
    var scrolledPercent = scrolledY / (containerHeight - scrollViewHeight);
    var bgScrolledOffset = (this.bgScape.getContentSize().height - scrollViewHeight) * scrolledPercent;

    this.updateBuyMsgBoxState();

    //手动将bounce disable掉，保证加速度滑动和非bounce兼容
    if(Math.abs(scrolledY) < kDisableBounceOffsetY || containerHeight - scrollViewHeight - Math.abs(scrolledY) < kDisableBounceOffsetY)
    {
        scrollView.setBounceable(false);
    }
    else
    {
        scrollView.setBounceable(true);
    }

    this.bgScape.setPositionY(bgScrolledOffset);
    this.wholeFloors.controller.UpdateWholeFloors(scrollView);

    debugMsgOutput("scrolled = " + scrolledPercent + " ,BG Off = " + bgScrolledOffset);
};

ChooseTestsScene.prototype.onPressedStartPlay = function()
{
	var floorNum = this.wholeFloors.controller.getCatStayAtFloorNum();
	var doorNum = this.wholeFloors.controller.getCatStayAtDoorNum();
	
	GuessScene_SetFloorInfo(floorNum*3 + (doorNum - 1), 1);
	
    var scene = cc.BuilderReader.loadAsScene("GuessScene.ccbi");
    cc.Director.getInstance().replaceScene(scene);
};

ChooseTestsScene.prototype.onPressedAwardButton = function()
{
    this.showBuyMessageBox();
};

ChooseTestsScene.prototype.onAnimationCompleted = function()
{
    if(this.sceneState == kFloorsSceneStateEnteringDoor && this.rootNode.animationManager.getLastCompletedSequenceName() == "Enter Door Timeline")
    {
        this.sceneState = kFloorsSceneStateNormal;
        var scene = cc.BuilderReader.loadAsScene("GuessScene.ccbi");
        cc.Director.getInstance().replaceScene(scene);
    }
};

ChooseTestsScene.prototype.onPressedDoor = function (isDoorOpened, floorNum, doorNum)
{
    if(isDoorOpened)
    {
        if(this.sceneState == kFloorsSceneStateNormal)
        {
            this.sceneState = kFloorsSceneStateEnteringDoor;
            GuessScene_SetFloorInfo(floorNum*3 + (doorNum - 1), 2);
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

ChooseTestsScene.prototype.showBuyMessageBox = function()
{
    if(this.buyMsgBox.showState != kBuyMessageBoxStateShowing)
    {
        this.buyMsgBox.controller.setFinishedPercents(ChooseTestsScene.prototype.testsFinishedPercent);
        this.buyMsgBox.animationManager.runAnimationsForSequenceNamed("Popup Animation Timeline");
        this.buyMsgBox.showState = kBuyMessageBoxStateShowing;
    }
};

ChooseTestsScene.prototype.onMsgboxAnimationCompleted = function()
{
    if(this.buyMsgBox.animationManager.getLastCompletedSequenceName() == "Dismiss Animation Timeline")
    {
        this.buyMsgBox.showState = kBuyMessageBoxStateClosedInTopRange;
    }
    this.updateBuyMsgBoxState();
};

ChooseTestsScene.prototype.checkWechatShared = function () {
	// 查询通过微信分享是否获得金币
	//if ( Global_isWeb() ) { // 页面版没有这个功能
	//    return ;	
	//}
	
	var time = sys.localStorage.getItem("WechatTime");
	if ( time == "" || time == null ) { 
		time = 0;
	}
	
	var now = Math.floor(Date.now() / 1000 / 3600);	// 小时
	
	debugMsgOutput(""+now);
	debugMsgOutput(""+time);
	
	if ( Math.abs(time - now) >= 0 ) {
		// 查服务器
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
	}
};

ChooseTestsScene.prototype.onPressedCollection = function () {
	// test
    if(!Global_isWeb())
    {
        memeda.OfferWallController.show();
    }
};

ChooseTestsScene.prototype.onClickedCoinButton = function () {
    // 打开金币购买界面
    debugMsgOutput("[UI Event] Clicked Coin Button!");
    this.buyCoinMsgBox.controller.show();
};

ChooseTestsScene.prototype.QueryExtraCoin = function () {
    var callBackObj = new Object();
    callBackObj.wachatDidFinish = function(responseText) {
        debugMsgOutput("wachatDidFinish " + responseText);
        this.parseWeChatData(responseText);
    };
    callBackObj.offerWallDidFinishCheck = function(responseText) {
        debugMsgOutput("offerWallDidFinishCheck " + responseText);
    };
    callBackObj.offerWallDidFinishConsume = function(responseText) {
        debugMsgOutput("offerWallDidFinishConsume " + responseText);
    };
    callBackObj.offerWallDidFailCheck = function() {
        debugMsgOutput("offerWallDidFailCheck");
    };
    callBackObj.offerWallDidFailConsume = function() {
        debugMsgOutput("offerWallDidFailConsume");
    };
    
    CoinMgr_checkExtraCoin(callBackObj);  // 检测额外的金币奖励，包括微信和多盟
    debugMsgOutput("-0-=-=-=-=-=");
};


ChooseTestsScene.prototype.parseWeChatData = function (text) {
    debugMsgOutput("---" + text);
    var obj = JSON.parse(text);
    debugMsgOutput("count : " + obj.list.length);
    if ( obj == null || obj.list == null || obj.list.length == 0 ) {
        return ;
    }
    
    var num = 0;
    for (var i = 0; i < obj.list.length; i ++ ) {
        num += obj.list[i].num;
    }
    debugMsgOutput("" + num);
    if ( num != 0 ) {
        this.weChatAwardMsg.controller.ShowMsg("您获得了" + num * 10 + "个金币", num * 10, function (coin) {
                                                CoinMgr_Change(coin);
                                           });
    }
};
