var NoEnoughMessageBox = function() {};


NoEnoughMessageBox.prototype.onDidLoadFromCCB = function () {
    // Do Scale
    this.rootNode.animationManager.setCompletedAnimationCallback(this, this.onAnimationComplete);
    
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

NoEnoughMessageBox.prototype.show = function(src, endFun) {
	this.msgLayout.setVisible(true);
	this.maskBkg.setVisible(true);
	this.endFun = endFun;
	this.src = src;
	
	this.bkgBtn.setVisible(true);

	this.rootNode.animationManager.runAnimationsForSequenceNamed("Begin Timeline");
};

NoEnoughMessageBox.prototype.onAnimationComplete = function () {
	var name = this.rootNode.animationManager.getLastCompletedSequenceName();
	if ( name == "End Timeline" ) {
		this.msgLayout.setVisible(false);		
	}
}

NoEnoughMessageBox.prototype.onClickBkg = function () {
};

NoEnoughMessageBox.prototype.Hide = function(res) {
	this.bkgBtn.setVisible(false);
	this.rootNode.animationManager.runAnimationsForSequenceNamed("End Timeline");
	this.maskBkg.setVisible(false);
	this.endFun(res);
};

NoEnoughMessageBox.prototype.onClickClose = function() {
	this.Hide(0);
};

NoEnoughMessageBox.prototype.onClickBuy = function() {
 	if ( !Global_isWeb() ) {
    	memeda.Stat.logEvent("showBuyCoinScene" + this.src);
	}
		
	this.Hide(1);	
};