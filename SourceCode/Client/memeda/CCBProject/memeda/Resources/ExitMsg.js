var ExitMsg = function() {};

ExitMsg.prototype.onClickBkg = function () {
};

ExitMsg.prototype.onDidLoadFromCCB = function () {
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

ExitMsg.prototype.ShowMsg = function() { 
	this.maskBkg.setVisible(true);
	
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Begin Timeline");
};

ExitMsg.prototype.Hide = function() {
	this.rootNode.animationManager.runAnimationsForSequenceNamed("End Timeline");
	this.maskBkg.setVisible(false);
};

ExitMsg.prototype.onClickClose = function() {
	this.Hide();
};

ExitMsg.prototype.onClickExit = function() {
    cc.Director.getInstance().end();
};

ExitMsg.prototype.onClickCancel = function() {
	this.Hide();
};