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
        
        this.msgLayout.setPositionY(-50);
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

	this.num1.setVisible(true);
	this.num2.setVisible(true);
	this.num3.setVisible(true);
	
	if ( price >= 100 ) {
		this.num1.setVisible(true);	
		
	    var image = "UI/common/tip_" + num0 + ".png";
        UtilsFunctions_setSpriteImageWithName(this.num1,image);
	    
	    image = "UI/common/tip_" + num1 + ".png";
        UtilsFunctions_setSpriteImageWithName(this.num2,image);
		
		image = "UI/common/tip_" + num2 + ".png";
        UtilsFunctions_setSpriteImageWithName(this.num3,image);
	} else if ( price >= 10 ) {
		this.num3.setVisible(false);	
		
	    var image = "UI/common/tip_" + num1 + ".png";
        UtilsFunctions_setSpriteImageWithName(this.num1,image);
        
		image = "UI/common/tip_" + num2 + ".png";
        UtilsFunctions_setSpriteImageWithName(this.num2,image);
	} else {
		this.num1.setVisible(false);
		this.num3.setVisible(false);
		
	    var image = "UI/common/tip_" + num2 + ".png";
        UtilsFunctions_setSpriteImageWithName(this.num2,image);
	}
    
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