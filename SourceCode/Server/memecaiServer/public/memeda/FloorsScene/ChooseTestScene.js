//
// ChooseTestsScene class
//

var ChooseTestsScene = function() {
};

ChooseTestsScene.prototype.onDidLoadFromCCB = function () {

    // 设备上面需要开启触摸
    if( 'touches' in sys.capabilities )
        this.rootNode.setTouchEnabled(true);

    // Start playing looped background music
    cc.AudioEngine.getInstance().playMusic("sounds/CAT_FIGHT_BG.mp3",true);
    cc.AudioEngine.getInstance().setMusicVolume(0.5);

    this.floorScrollView.setDelegate(this);
    this.wholeFloors = this.floorScrollView.getContainer();
    //debugMsgOutput(this.wholeFloors.getPositionX() + this.wholeFloors.getPositionY());
    this.scrollViewDidScroll(this.floorScrollView);
};

ChooseTestsScene.prototype.scrollViewDidZoom = function (scrollView)
{
    debugMsgOutput("scroll zooming!");
    //this.bgScape
};

ChooseTestsScene.prototype.scrollViewDidScroll = function (scrollView)
{
    var containerHeight = scrollView.getContentSize().height;
    var scrolledY = scrollView.getContentOffset().y;
    var scrollViewHeight = scrollView.getViewSize().height;
    var scrolledPercent = scrolledY / (containerHeight - scrollViewHeight);
    var bgScrolledOffset = (this.bgScape.getContentSize().height - scrollViewHeight) * scrolledPercent;
    this.bgScape.setPositionY(bgScrolledOffset);
    this.wholeFloors.controller.UpdateWholeFloors(scrollView);

    debugMsgOutput("scrolled = " + scrolledPercent + " ,BG Off = " + bgScrolledOffset);
};