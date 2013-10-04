var JumpMsgBox = function() {};

JumpMsgBox.prototype.onDidLoadFromCCB = function () {
    // Do Scale
    var screenSize = cc.Director.getInstance().getWinSizeInPixels();
    var screenWidth = screenSize.width > screenSize.height ? screenSize.height : screenSize.width;
    var screenHeight = screenSize.width > screenSize.height ? screenSize.width : screenSize.height;

    // 针对非iphone5屏幕做缩小适配
    if(screenHeight / screenWidth < 1136/640)
    {   
        this.msgLayout.setScaleX(0.84);
        this.msgLayout.setScaleY(0.84);
    }
};

JumpMsgBox.prototype.ShowMsg = function(price, endFun) { 
	this.maskBkg.setVisible(true);
	this.endFun = endFun;
	this.price = price;
	
	var num0 = Math.floor(price / 100);
	var num1 = Math.floor((price % 100) / 10);
	var num2 = price % 10;

    var image = "UI/guess/tip_" + num0 + ".png";
    var spriteFrame = cc.SpriteFrame.create(image, cc.rect(0,0,19,29));
    this.num0.setDisplayFrame(spriteFrame);
    
    image = "UI/guess/tip_" + num1 + ".png";
    spriteFrame = cc.SpriteFrame.create(image, cc.rect(0,0,19,29));
    this.num1.setDisplayFrame(spriteFrame);
	
	image = "UI/guess/tip_" + num2 + ".png";
    spriteFrame = cc.SpriteFrame.create(image, cc.rect(0,0,19,29));
    this.num2.setDisplayFrame(spriteFrame);
        
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Begin Timeline");
};

JumpMsgBox.prototype.Hide = function(res) {
	this.rootNode.animationManager.runAnimationsForSequenceNamed("End Timeline");
	this.maskBkg.setVisible(false);
	this.endFun(res);
};

JumpMsgBox.prototype.onClickClose = function() {
	this.Hide(0);
};

JumpMsgBox.prototype.onClickBuy = function() {
	// 扣金币
	if ( CoinMgr_GetCount() < this.price ) {
		// 金币不够
		this.noEnoughEvent();
		this.Hide(1);
	} else {
		CoinMgr_Change(-1 * this.price);
		// 加入到跳过题目的列表
		this.Hide(1);
	}
};