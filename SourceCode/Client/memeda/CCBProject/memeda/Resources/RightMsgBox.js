var RightMsgBox = function() {};

RightMsgBox.prototype.onDidLoadFromCCB = function () {
    this.rootNode.animationManager.setCompletedAnimationCallback(this, this.onAnimationComplete);
    
       // Do Scale
    var screenSize = cc.Director.getInstance().getWinSizeInPixels();
    var screenWidth = screenSize.width > screenSize.height ? screenSize.height : screenSize.width;
    var screenHeight = screenSize.width > screenSize.height ? screenSize.width : screenSize.height;

    // 针对非iphone5屏幕做缩小适配
    if(screenHeight / screenWidth < 1136/640)
    {   
        this.msgLayout.setScaleX(0.98);
        this.msgLayout.setScaleY(0.98);
    }
};

RightMsgBox.prototype.ShowMsg = function(url, onClose) {
	this.onCloseFun = onClose;
	this.msgLayout.setVisible(true);
	this.Url = url;
	this.aboutUrl.setString(url);
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Default Timeline");
};

RightMsgBox.prototype.onClickNext = function() {
	this.onCloseFun();	
}

RightMsgBox.prototype.onClickURL = function() {
	
}

RightMsgBox.prototype.Hide = function () {
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Hide Timeline");	
}

RightMsgBox.prototype.onAnimationComplete = function() {
	if ( this.rootNode.animationManager.getLastCompletedSequenceName() == "Hide Timeline" ) {
		this.msgLayout.setVisible(false);	
	}
}