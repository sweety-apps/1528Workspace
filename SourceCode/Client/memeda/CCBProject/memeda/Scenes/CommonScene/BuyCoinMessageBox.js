//
// BuyCoinMessageBox class
//

//商品命名
var kBuyCoinNameBuy300 = "300金币";
var kBuyCoinNameBuy600 = "600金币";
var kBuyCoinNameBuy1500 = "1500金币";
var kBuyCoinNameBuy3000 = "3000金币";

var BuyCoinMessageBox = function() {
};

BuyCoinMessageBox.prototype.sceneState = kFloorsSceneStateNormal;

BuyCoinMessageBox.prototype.productID = "";
BuyCoinMessageBox.prototype.purchaseName = "";
BuyCoinMessageBox.prototype.isPurchaseCoinsHere = true;
BuyCoinMessageBox.prototype.coninAddNum = 0;
BuyCoinMessageBox.prototype.hiddenCallbackTarget = null;
BuyCoinMessageBox.prototype.hiddenCallbackMethod = null;
BuyCoinMessageBox.prototype.purchaseHasSucceed = false;

BuyCoinMessageBox.prototype.onDidLoadFromCCB = function () {
	// 设备上面需要开启触摸
    cc.SpriteFrameCache.getInstance().addSpriteFrames("UI/buy_coin_msgbox.plist");
    
    if( 'touches' in sys.capabilities )
        this.rootNode.setTouchEnabled(true);

    // Start playing looped background music
    if ( !Global_isWeb() ) {

    }
};

BuyCoinMessageBox.prototype.show = function ()
{
    if ( !Global_isWeb() ) {
		memeda.Stat.logEvent("buyCoinMessagebox");
    }
    
    this.purchaseHasSucceed = false;
    this.purchaseName = null;
    this.productID = null;
    this.coninAddNum = 0;
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Popup Timeline");
    this.isPurchaseCoinsHere = true;
};

BuyCoinMessageBox.prototype.doCallbackFunctions = function()
{
    //回调
    if(this.hiddenCallbackMethod != null && this.hiddenCallbackMethod != null)
    {
        if(this.hiddenCallbackTarget != null && this.hiddenCallbackTarget != null)
        {
            this.hiddenCallbackTarget.hiddenCallbackMethodTmp = this.hiddenCallbackMethod;
            this.hiddenCallbackTarget.hiddenCallbackMethodTmp(this.productID,this.purchaseHasSucceed);
            this.hiddenCallbackTarget.hiddenCallbackMethodTmp = null;
        }
        else
        {
            this.hiddenCallbackMethod(this.productID,this.purchaseHasSucceed);
        }
    }
    this.hiddenCallbackTarget = null;
    this.hiddenCallbackMethod = null;
};

BuyCoinMessageBox.prototype.hide = function ()
{
    this.doCallbackFunctions();
    //隐藏动画
    this.purchaseName = null;
    this.productID = null;
    this.purchaseHasSucceed = false;
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
    this.productID = productID;
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
    this.doCallbackFunctions();
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Succeed Pay Dismiss Timeline");
};

BuyCoinMessageBox.prototype.onClickedBuy6 = function ()
{
    if ( !Global_isWeb() ) {
		var param = memeda.Stat.createParam();
		param.addKeyAndValue("price", "6");		
		memeda.Stat.logEvent("clickbuycoin", param);
    }
    
    this.clickPrice = 6;
    
    debugMsgOutput("[UI Event]Clicked BuyCoinBox Buy 6!");
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Start Pay Timeline");
    this.purchaseName = kBuyCoinNameBuy300;
    Purchase_payForCoinWith6RMB(this,this.onBuyItemFinished);
};

BuyCoinMessageBox.prototype.onClickedBuy12 = function ()
{
    if ( !Global_isWeb() ) {
		var param = memeda.Stat.createParam();
		param.addKeyAndValue("price", "12");		
		memeda.Stat.logEvent("clickbuycoin", param);
    }

    this.clickPrice = 12;
        
    debugMsgOutput("[UI Event]Clicked BuyCoinBox Buy 12!");
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Start Pay Timeline");
    this.purchaseName = kBuyCoinNameBuy600;
    Purchase_payForCoinWith12RMB(this,this.onBuyItemFinished);
};

BuyCoinMessageBox.prototype.onClickedBuy30 = function ()
{
    if ( !Global_isWeb() ) {
		var param = memeda.Stat.createParam();
		param.addKeyAndValue("price", "30");		
		memeda.Stat.logEvent("clickbuycoin", param);
    }
    
    this.clickPrice = 30;
    
    debugMsgOutput("[UI Event]Clicked BuyCoinBox Buy 30!");
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Start Pay Timeline");
    this.purchaseName = kBuyCoinNameBuy1500;
    Purchase_payForCoinWith30RMB(this,this.onBuyItemFinished);
};

BuyCoinMessageBox.prototype.onClickedBuy60 = function ()
{
    if ( !Global_isWeb() ) {
		var param = memeda.Stat.createParam();
		param.addKeyAndValue("price", "60");		
		memeda.Stat.logEvent("clickbuycoin", param);
    }
    
    this.clickPrice = 60;
    
    debugMsgOutput("[UI Event]Clicked BuyCoinBox Buy 60!");
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Start Pay Timeline");
    this.purchaseName = kBuyCoinNameBuy3000;
    Purchase_payForCoinWith60RMB(this,this.onBuyItemFinished);
};

BuyCoinMessageBox.prototype.onBuyItemSucceed = function (itemName,state,msg)
{
    if ( !Global_isWeb() ) {
		var param = memeda.Stat.createParam();
		param.addKeyAndValue("price", "" + this.clickPrice);		
		memeda.Stat.logEvent("buycoinsuccess", param);
    }
    
    debugMsgOutput("\<IAP Callback\> On Buy "+itemName+" Succeed!");
    this.calculateCoinAddNum();
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Enter Succeed Pay Timeline");
};

BuyCoinMessageBox.prototype.onBuyItemFailedOrCancelled = function (itemName,state,msg)
{
    debugMsgOutput("\<IAP Callback\> On Buy "+itemName+" Failed! :(");
    this.coninAddNum = 0;
    this.purchaseHasSucceed = false;
    if(this.isPurchaseCoinsHere)
    {
        this.rootNode.animationManager.runAnimationsForSequenceNamed("Reset Timeline");
    }
    else
    {
        this.hide();
    }
};

BuyCoinMessageBox.prototype.calculateCoinAddNum = function ()
{
    if(this.purchaseName == kBuyCoinNameBuy300)
    {
        this.purchaseHasSucceed = true;
        this.coninAddNum = 300;
    }
    else if(this.purchaseName == kBuyCoinNameBuy600)
    {
        this.purchaseHasSucceed = true;
        this.coninAddNum = 600;
    }
    else if(this.purchaseName == kBuyCoinNameBuy1500)
    {
        this.purchaseHasSucceed = true;
        this.coninAddNum = 1500;
    }
    else if(this.purchaseName == kBuyCoinNameBuy3000)
    {
        this.purchaseHasSucceed = true;
        this.coninAddNum = 3666;
    }
    else if(this.productID != null && this.productID.length > 0)
    {
        if(this.productID == Purchase_getSpyPackageProductID())
        {
            this.purchaseHasSucceed = true;
            this.coninAddNum = 1000;
            SpecialSpyPackageMgr_SetPurchased();
        }
    }
};