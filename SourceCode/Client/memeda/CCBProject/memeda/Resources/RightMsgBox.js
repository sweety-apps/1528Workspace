var RightMsgBox = function() {};
var gRightMsgBoxThis = null;

RightMsgBox.prototype.onDidLoadFromCCB = function () {
	gRightMsgBoxThis = this;
    this.rootNode.animationManager.setCompletedAnimationCallback(this, this.onAnimationComplete);
    
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

RightMsgBox.prototype.ShowMsg = function(onClose) {
	this.onCloseFun = onClose;
	this.rootLayout.setVisible(true);
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Default Timeline");
};

RightMsgBox.prototype.onClickNext = function() {
	this.onCloseFun();	
}

RightMsgBox.prototype.Hide = function () {
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Hide Timeline");	
}

RightMsgBox.prototype.onAnimationComplete = function() {
	if ( gRightMsgBoxThis.rootNode.animationManager.getLastCompletedSequenceName() == "Hide Timeline" ) {
		gRightMsgBoxThis.rootLayout.setVisible(false);	
	}
}