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

WechatAwardMsg.prototype.ShowMsg = function(msg, coin, endFun, index) {
	this.maskBkg.setVisible(true);
	this.endFun = endFun;
	this.coin = coin;
    this.index = index;
	
    this.msgText.setString(msg);
    
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Begin Timeline");
};

WechatAwardMsg.prototype.Hide = function(res) {
	this.rootNode.animationManager.runAnimationsForSequenceNamed("End Timeline");
	this.maskBkg.setVisible(false);
	this.endFun(this.coin);
};

WechatAwardMsg.prototype.onClickClose = function() {
	this.Hide();
};

WechatAwardMsg.prototype.onClickBuy = function() {
	this.Hide();	
};