var NewTask = function() {};

NewTask.prototype.onDidLoadFromCCB = function () {
	this.rootNode.animationManager.setCompletedAnimationCallback(this, this.onAnimationComplete);
	
    // Do Scale
    var screenSize = cc.Director.getInstance().getWinSizeInPixels();
    var screenWidth = screenSize.width > screenSize.height ? screenSize.height : screenSize.width;
    var screenHeight = screenSize.width > screenSize.height ? screenSize.width : screenSize.height;
/*
    // 针对非iphone5屏幕做缩小适配
    if(screenHeight / screenWidth < 1136/640)
    {   
        this.msgLayout.setScaleX(0.84);
        this.msgLayout.setScaleY(0.84);
        
        this.msgLayout.setPositionY(-45);
    } */
    this.showTip = false;
};

NewTask.prototype.onAnimationComplete = function()
{
	var aniName = this.rootNode.animationManager.getLastCompletedSequenceName();
	if ( aniName == "Show Timeline" ) {
		this.showTip = false;
	}	
}
    
NewTask.prototype.onClick = function () {
	if ( this.showTip ) {
		return ;
	}
	
	this.showTip = true;
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Show Timeline");
}