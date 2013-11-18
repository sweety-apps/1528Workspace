var TaskTip = function() {};

TaskTip.prototype.onDidLoadFromCCB = function () {
    this.rootNode.animationManager.setCompletedAnimationCallback(this, this.onAnimationComplete);
    this.isHide = false;
    
    var screenSize = cc.Director.getInstance().getWinSizeInPixels();
    var screenWidth = screenSize.width > screenSize.height ? screenSize.height : screenSize.width;
    var screenHeight = screenSize.width > screenSize.height ? screenSize.width : screenSize.height;
   	if(screenHeight / screenWidth < 1136/640) {       	
     	this.taskTip5.setVisible(false);
    	this.taskTip4.setVisible(true);
    } else {
    	this.taskTip5.setVisible(true);
    	this.taskTip4.setVisible(false);
    }
};

TaskTip.prototype.onClickTaskTip = function() {
	if ( !this.isHide ) {
		this.isHide = true;
    	this.rootNode.animationManager.runAnimationsForSequenceNamed("Hide Timeline");	
	}
}

TaskTip.prototype.onAnimationComplete = function()
{
    if(this.rootNode.animationManager.getLastCompletedSequenceName() == "Hide Timeline")
    {
    	this.onClick();
    }
};