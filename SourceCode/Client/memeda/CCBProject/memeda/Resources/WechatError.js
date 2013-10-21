var WechatError = function() {};


WechatError.prototype.onDidLoadFromCCB = function () {
	gBuyMsgThis = this;
	
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

WechatError.prototype.ShowMsg = function(msg, endFun) {
	this.maskBkg.setVisible(true);
	this.endFun = endFun;

	if ( msg.indexOf("安装") > 0 ) {
    	this.msgText.setString(msg);
	} else {
    	this.msgText.setString("您可以重新试试");
	}
	
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Begin Timeline");
};

WechatError.prototype.Hide = function(res) {
	this.rootNode.animationManager.runAnimationsForSequenceNamed("End Timeline");
	this.maskBkg.setVisible(false);
	this.endFun(res);
};

WechatError.prototype.onClickClose = function() {
	this.Hide(0);
};

WechatError.prototype.onClickBuy = function() {
	this.Hide(0);
};

WechatError.prototype.onClickBkg = function () {
};