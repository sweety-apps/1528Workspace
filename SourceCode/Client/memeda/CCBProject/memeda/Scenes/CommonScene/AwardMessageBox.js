//
// AwardMessageBox class
//

//场景状态
var kAwardMessageBoxStateHidden = 0;
var kAwardMessageBoxStatePopup = 1;
var kAwardMessageBoxStateShowing = 2;
var kAwardMessageBoxStateHiding = 1;

var pAwardMessageBox = null;

var AwardMessageBox = function() {
};

AwardMessageBox.prototype.sceneState = kFloorsSceneStateNormal;

AwardMessageBox.prototype.onDidLoadFromCCB = function () {
	pAwardMessageBox = this;
	
	// 设备上面需要开启触摸
    if( 'touches' in sys.capabilities )
        this.rootNode.setTouchEnabled(true);

    // Start playing looped background music
    if ( !Global_isWeb() ) {

    }
};

AwardMessageBox.prototype.show = function ()
{
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Popup Timeline");
};

AwardMessageBox.prototype.hide = function ()
{
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Dismiss Timeline");
};

AwardMessageBox.prototype.onClickedModelBG = function ()
{
    debugMsgOutput("[UI Event]Clicked BuyCoinBox Model BG!");
};

AwardMessageBox.prototype.onClickedClose = function ()
{
    debugMsgOutput("[UI Event]Clicked BuyCoinBox Close!");
    this.hide();
};

AwardMessageBox.prototype.onClickedBuy6 = function ()
{	// 评论
	var url = "itms-apps://ax.itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?mt=8&onlyLatestVersion=true&pageNumber=0&sortOrdering=1&type=Purple+Software&id=";
	url = url + "1234567890";
	memeda.common.openURL(url);
};

AwardMessageBox.prototype.onClickedBuy12 = function ()
{	// 分享
	this.weChatMsg.controller.ShowMsg(null, function () {
    	}, 
    	function () {
    		pAwardMessageBox.checkWeChat();
    	});
};

AwardMessageBox.prototype.checkWeChat = function () {
	var showsharecoin = sys.localStorage.getItem("showsharecoin");
	if ( showsharecoin == "1" ) {
		sys.localStorage.setItem("showsharecoin", "2");	// 准备显示第一次分享奖励
		this.weChatCoinMsgBox.controller.show(function () {
			CoinMgr_Change(500);
		});
	}
}

AwardMessageBox.prototype.onClickedBuy30 = function ()
{
    debugMsgOutput("[UI Event]Clicked BuyCoinBox Buy 30!");
    Purchase_payForCoinWith30RMB();
};

AwardMessageBox.prototype.onClickedBuy60 = function ()
{
    debugMsgOutput("[UI Event]Clicked BuyCoinBox Buy 60!");
    Purchase_payForCoinWith60RMB();
};