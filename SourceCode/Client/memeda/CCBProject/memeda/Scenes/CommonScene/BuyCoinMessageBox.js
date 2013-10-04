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

BuyCoinMessageBox.prototype.purchaseID = "";
BuyCoinMessageBox.prototype.isPurchaseCoinsHere = true;

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
    this.isPurchaseCoinsHere = true;
};

BuyCoinMessageBox.prototype.hide = function ()
{
    if(this.isPurchaseCoinsHere)
    {
        this.rootNode.animationManager.runAnimationsForSequenceNamed("Dismiss Timeline");
    }
    else
    {
        this.rootNode.animationManager.runAnimationsForSequenceNamed("Normal Dismiss Timeline");
    }
};

BuyCoinMessageBox.prototype.showAndBuyItem = function (itemName,productID)
{
    this.isPurchaseCoinsHere = false;
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Normal Buy Popup Timeline");
    this.purchaseID = itemName;
    Purchase_payForItem(productID,this,this.onBuyItemFinished);
};

BuyCoinMessageBox.prototype.onBuyItemFinished = function(state,productID,errMsg)
{
    if(state == "Success")
    {
        this.onBuyItemSucceed(this.purchaseID,state,errMsg);
    }
    else if(state == "Failed" || state == "Cancel")
    {
        this.onBuyItemFailedOrCancelled(this.purchaseID,state,errMsg);
    }
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
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Start Pay Timeline");
    this.purchaseID = "300金币";
    Purchase_payForCoinWith6RMB(this,this.onBuyItemFinished);
};

BuyCoinMessageBox.prototype.onClickedBuy12 = function ()
{
    debugMsgOutput("[UI Event]Clicked BuyCoinBox Buy 12!");
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Start Pay Timeline");
    this.purchaseID = "600金币";
    Purchase_payForCoinWith12RMB(this,this.onBuyItemFinished);
};

BuyCoinMessageBox.prototype.onClickedBuy30 = function ()
{
    debugMsgOutput("[UI Event]Clicked BuyCoinBox Buy 30!");
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Start Pay Timeline");
    this.purchaseID = "1500金币";
    Purchase_payForCoinWith30RMB(this,this.onBuyItemFinished);
};

BuyCoinMessageBox.prototype.onClickedBuy60 = function ()
{
    debugMsgOutput("[UI Event]Clicked BuyCoinBox Buy 60!");
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Start Pay Timeline");
    this.purchaseID = "3000金币";
    Purchase_payForCoinWith60RMB(this,this.onBuyItemFinished);
};

BuyCoinMessageBox.prototype.onBuyItemSucceed = function (itemName,state,msg)
{
    debugMsgOutput("\<IAP Callback\> On Buy "+itemName+" Succeed!");
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Enter Succeed Pay Timeline");
};

BuyCoinMessageBox.prototype.onBuyItemFailedOrCancelled = function (itemName,state,msg)
{
    debugMsgOutput("\<IAP Callback\> On Buy "+itemName+" Failed! :(");
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Reset Timeline");
};