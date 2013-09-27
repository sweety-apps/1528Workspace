//
// ChooseTestsScene class
//

var kDisableBounceOffsetY = 40;
var kBuyMessageBoxShowOffsetToTop = 480;

//状态
var kBuyMessageBoxStateHidden = 0;
var kBuyMessageBoxStateClosedInTopRange = 1;
var kBuyMessageBoxStateShowing = 2;

var kScrollingStateNormal = 0;
var kScrollingStateReachedBoxShowOffset = 1;

var ChooseTestsScene = function() {
};

ChooseTestsScene.prototype.onDidLoadFromCCB = function () {
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

    //设置状态
    this.buyMsgBox.showState = kBuyMessageBoxStateHidden;
    this.wholeFloors.scrollState = kScrollingStateNormal;
    this.buyMsgBox.animationManager.setCompletedAnimationCallback(this, this.onMsgboxAnimationCompleted);
    
    this.checkWechatShared();
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

ChooseTestsScene.prototype.onPressedDoor = function (isDoorOpened, floorNum, doorNum)
{
    if(isDoorOpened)
    {
		GuessScene_SetFloorInfo(floorNum*3 + (doorNum - 1), 2);
	
    	var scene = cc.BuilderReader.loadAsScene("GuessScene.ccbi");
    	cc.Director.getInstance().replaceScene(scene);
    }
    else
    {
        this.onPressedAwardButton();
    }
};

ChooseTestsScene.prototype.showBuyMessageBox = function()
{
    if(this.buyMsgBox.showState != kBuyMessageBoxStateShowing)
    {
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

	var now = Date.now();
	debugMsgOutput(""+now);
	debugMsgOutput(""+time);
}