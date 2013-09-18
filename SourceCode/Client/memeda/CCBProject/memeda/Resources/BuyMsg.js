var BuyMsg = function() {};
var gBuyMsgThis = null;




BuyMsg.prototype.onDidLoadFromCCB = function () {
	gBuyMsgThis = this;
	
    // Do Scale
    var screenSize = cc.Director.getInstance().getWinSizeInPixels();
    var screenWidth = screenSize.width > screenSize.height ? screenSize.height : screenSize.width;
    var screenHeight = screenSize.width > screenSize.height ? screenSize.width : screenSize.height;

    // 针对非iphone5屏幕做缩小适配
    if(screenHeight / screenWidth < 1136/640)
    {   
    //    var pos = cc.p(screenWidth / 2, -80);
    //	this.msgLayout.setPosition(pos);
    }
};

BuyMsg.prototype.ShowMsg = function(price, msg, endFun) {
	// 显示购买消息
	this.maskBkg.setVisible(true);
	this.endFun = endFun;
	this.price = price;
	
	var num1 = Math.floor(price / 10);
	var num2 = price % 10;

    var image = "UI/guess/tip_" + num1 + ".png";
    var spriteFrame = cc.SpriteFrame.create(image, cc.rect(0,0,19,29));
    this.num1.setDisplayFrame(spriteFrame);
	
	image = "UI/guess/tip_" + num2 + ".png";
    spriteFrame = cc.SpriteFrame.create(image, cc.rect(0,0,19,29));
    this.num2.setDisplayFrame(spriteFrame);
    
    this.msgText.setString(msg);
    
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Begin Timeline");
};

BuyMsg.prototype.Hide = function(res) {
	this.rootNode.animationManager.runAnimationsForSequenceNamed("End Timeline");
	this.maskBkg.setVisible(false);
	this.endFun(res);
};

BuyMsg.prototype.onClickClose = function() {
	this.Hide(0);
};

BuyMsg.prototype.onClickBuy = function() {
	// 扣金币
	// TODO : 金币不足的判断还没有
	CoinMgr_Change(-1 * this.price);
	this.Hide(1);	
};