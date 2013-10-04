var WeChatCoinMessageBox = function() {};


WeChatCoinMessageBox.prototype.onDidLoadFromCCB = function () {
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

WeChatCoinMessageBox.prototype.show = function(endFun) {
	this.maskBkg.setVisible(true);
	this.endFun = endFun;

	this.rootNode.animationManager.runAnimationsForSequenceNamed("Begin Timeline");
};

WeChatCoinMessageBox.prototype.Hide = function(res) {
	this.rootNode.animationManager.runAnimationsForSequenceNamed("End Timeline");
	this.maskBkg.setVisible(false);
	this.endFun(res);
};

WeChatCoinMessageBox.prototype.onClickClose = function() {
	this.Hide(0);
};

WeChatCoinMessageBox.prototype.onClickBuy = function() {
	this.Hide(1);	
};