//
// BuyCoinMessageBox class
//

//场景状态
var kBuyCoinMessageBoxStateHidden = 0;
var kBuyCoinMessageBoxStatePopup = 1;
var kBuyCoinMessageBoxStateShowing = 2;
var kBuyCoinMessageBoxStateHiding = 1;

var BuyCoinMessageBox = function() {
};

BuyCoinMessageBox.prototype.sceneState = kFloorsSceneStateNormal;

BuyCoinMessageBox.prototype.onDidLoadFromCCB = function () {
	// 设备上面需要开启触摸
    if( 'touches' in sys.capabilities )
        this.rootNode.setTouchEnabled(true);

    // Start playing looped background music
    if ( !Global_isWeb() ) {

    }
};

BuyCoinMessageBox.prototype.show = function ()
{
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Popup Timeline");
};

BuyCoinMessageBox.prototype.hide = function ()
{
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Dismiss Timeline");
};

BuyCoinMessageBox.prototype.onClickedModelBG = function ()
{
    debugMsgOutput("[UI Event]Clicked BuyCoinBox Model BG!");
};

BuyCoinMessageBox.prototype.onClickedClose = function ()
{
    debugMsgOutput("[UI Event]Clicked BuyCoinBox Close!");
    this.hide();
};

BuyCoinMessageBox.prototype.onClickedBuy6 = function ()
{
    debugMsgOutput("[UI Event]Clicked BuyCoinBox Buy 6!");
    Purchase_payForCoinWith6RMB();
};

BuyCoinMessageBox.prototype.onClickedBuy12 = function ()
{
    debugMsgOutput("[UI Event]Clicked BuyCoinBox Buy 12!");
    Purchase_payForCoinWith12RMB();
};

BuyCoinMessageBox.prototype.onClickedBuy30 = function ()
{
    debugMsgOutput("[UI Event]Clicked BuyCoinBox Buy 30!");
    Purchase_payForCoinWith30RMB();
};

BuyCoinMessageBox.prototype.onClickedBuy60 = function ()
{
    debugMsgOutput("[UI Event]Clicked BuyCoinBox Buy 60!");
    Purchase_payForCoinWith60RMB();
};