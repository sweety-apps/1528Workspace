var WechatAwardMsg = function() {};

WechatAwardMsg.prototype.onDidLoadFromCCB = function () {
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

WechatAwardMsg.prototype.ShowMsg = function(msg, price, endFun, index) {
	this.maskBkg.setVisible(true);
	this.endFun = endFun;
	this.coin = price;
    this.index = index;
	this.bkgBtn.setVisible(true);
	
    this.msgText.setString(msg);
    
	var num0 = Math.floor(price / 100);
	var num1 = Math.floor((price % 100) / 10);
	var num2 = price % 10;

	if ( price >= 100 ) {
		this.num1.setVisible(true);	
	} else {
		this.num1.setVisible(false);	
	}
	
	if ( price >= 10 ) {
		this.num2.setVisible(true);	
	} else {
		this.num2.setVisible(false);
	}
	
    var image = "UI/guess/tip_" + num0 + ".png";
    var spriteFrame = cc.SpriteFrame.create(image, cc.rect(0,0,19,29));
    this.num1.setDisplayFrame(spriteFrame);
    
    image = "UI/guess/tip_" + num1 + ".png";
    spriteFrame = cc.SpriteFrame.create(image, cc.rect(0,0,19,29));
    this.num2.setDisplayFrame(spriteFrame);
	
	image = "UI/guess/tip_" + num2 + ".png";
    spriteFrame = cc.SpriteFrame.create(image, cc.rect(0,0,19,29));
    this.num3.setDisplayFrame(spriteFrame);
    
    
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Begin Timeline");
};

WechatAwardMsg.prototype.Hide = function(res) {
	this.rootNode.animationManager.runAnimationsForSequenceNamed("End Timeline");
	this.maskBkg.setVisible(false);
	this.bkgBtn.setVisible(false);
	this.endFun(this.coin);
};

WechatAwardMsg.prototype.onClickClose = function() {
	this.Hide();
};

WechatAwardMsg.prototype.onClickBuy = function() {
	this.Hide();	
};