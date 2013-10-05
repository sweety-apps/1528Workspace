//
// BuyCoinMessageBox class
//

//场景状态
var kBuyCoinMessageBoxStateHidden = 0;
var kBuyCoinMessageBoxStatePopup = 1;
var kBuyCoinMessageBoxStateShowing = 2;
var kBuyCoinMessageBoxStateHiding = 3;

//商品命名
var kBuyCoinNameBuy300 = "300金币";
var kBuyCoinNameBuy600 = "600金币";
var kBuyCoinNameBuy1500 = "1500金币";
var kBuyCoinNameBuy3000 = "3000金币";

var BuyCoinMessageBox = function() {
};

BuyCoinMessageBox.prototype.sceneState = kFloorsSceneStateNormal;

BuyCoinMessageBox.prototype.producID = "";
BuyCoinMessageBox.prototype.purchaseName = "";
BuyCoinMessageBox.prototype.isPurchaseCoinsHere = true;
BuyCoinMessageBox.prototype.coninAddNum = 0;

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
    this.purchaseName = null;
    this.producID = null;
    this.coninAddNum = 0;
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Popup Timeline");
    this.isPurchaseCoinsHere = true;
};

BuyCoinMessageBox.prototype.hide = function ()
{
    this.purchaseName = null;
    this.producID = null;
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
    this.coninAddNum = 0;
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Normal Buy Popup Timeline");
    this.purchaseName = itemName;
    this.producID = productID;
    Purchase_payForItem(productID,this,this.onBuyItemFinished);
};

BuyCoinMessageBox.prototype.onBuyItemFinished = function(state,productID,errMsg)
{
    if(state == "Success")
    {
        this.onBuyItemSucceed(this.purchaseName,state,errMsg);
    }
    else if(state == "Failed" || state == "Cancel")
    {
        this.onBuyItemFailedOrCancelled(this.purchaseName,state,errMsg);
    }
};

BuyCoinMessageBox.prototype.onClickedModelBG = function ()
{
    debugMsgOutput("[UI Event]Clicked BuyCoinBox Model BG!");
};

BuyCoinMessageBox.prototype.onClickedModelBGBigBlock = function ()
{
    debugMsgOutput("[UI Event]Clicked BuyCoinBox Model BG!");
    if(Global_isWeb())
    {
        this.onBuyItemFinished("Success","","");
        //this.onBuyItemFinished("Failed","","");
    }
};

BuyCoinMessageBox.prototype.onClickedClose = function ()
{
    debugMsgOutput("[UI Event]Clicked BuyCoinBox Close!");
    this.hide();
};

BuyCoinMessageBox.prototype.onClickedGetCoin = function ()
{
    debugMsgOutput("[UI Event]Clicked BuyCoinBox Close!");
    if(this.coninAddNum != 0)
    {
        CoinMgr_Change(this.coninAddNum);
    }
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Succeed Pay Dismiss Timeline");
};

BuyCoinMessageBox.prototype.onClickedBuy6 = function ()
{
    debugMsgOutput("[UI Event]Clicked BuyCoinBox Buy 6!");
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Start Pay Timeline");
    this.purchaseName = kBuyCoinNameBuy300;
    Purchase_payForCoinWith6RMB(this,this.onBuyItemFinished);
};

BuyCoinMessageBox.prototype.onClickedBuy12 = function ()
{
    debugMsgOutput("[UI Event]Clicked BuyCoinBox Buy 12!");
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Start Pay Timeline");
    this.purchaseName = kBuyCoinNameBuy600;
    Purchase_payForCoinWith12RMB(this,this.onBuyItemFinished);
};

BuyCoinMessageBox.prototype.onClickedBuy30 = function ()
{
    debugMsgOutput("[UI Event]Clicked BuyCoinBox Buy 30!");
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Start Pay Timeline");
    this.purchaseName = kBuyCoinNameBuy1500;
    Purchase_payForCoinWith30RMB(this,this.onBuyItemFinished);
};

BuyCoinMessageBox.prototype.onClickedBuy60 = function ()
{
    debugMsgOutput("[UI Event]Clicked BuyCoinBox Buy 60!");
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Start Pay Timeline");
    this.purchaseName = kBuyCoinNameBuy3000;
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
    this.coninAddNum = 0;
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Reset Timeline");
};

BuyCoinMessageBox.prototype.calculateCoinAddNum = function ()
{
    if(this.purchaseName == kBuyCoinNameBuy300)
    {
        this.coninAddNum = 300;
    }
    else if(this.purchaseName == kBuyCoinNameBuy600)
    {
        this.coninAddNum = 600;
    }
    else if(this.purchaseName == kBuyCoinNameBuy1500)
    {
        this.coninAddNum = 1500;
    }
    else if(this.purchaseName == kBuyCoinNameBuy3000)
    {
        this.coninAddNum = 3666;
    }
    else if(this.producID != null && this.producID.length > 0)
    {
        if(this.producID == Purchase_getSpyPackageProductID())
        {
            this.coninAddNum = 1000;
        }
    }

    this.rootNode.animationManager.runAnimationsForSequenceNamed("Reset Timeline");
};