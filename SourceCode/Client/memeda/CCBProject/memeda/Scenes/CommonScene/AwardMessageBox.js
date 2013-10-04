//
// AwardMessageBox class
//

//场景状态
var kAwardMessageBoxStateHidden = 0;
var kAwardMessageBoxStatePopup = 1;
var kAwardMessageBoxStateShowing = 2;
var kAwardMessageBoxStateHiding = 1;

var AwardMessageBox = function() {
};

AwardMessageBox.prototype.sceneState = kFloorsSceneStateNormal;

AwardMessageBox.prototype.onDidLoadFromCCB = function () {
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
{
    debugMsgOutput("[UI Event]Clicked BuyCoinBox Buy 6!");
    Purchase_payForCoinWith6RMB();
};

AwardMessageBox.prototype.onClickedBuy12 = function ()
{
    debugMsgOutput("[UI Event]Clicked BuyCoinBox Buy 12!");
    Purchase_payForCoinWith12RMB();
};

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