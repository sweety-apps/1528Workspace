var About = function() {};

About.prototype.onClickBkg = function () {
	
};

About.prototype.onDidLoadFromCCB = function () {
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
        
        this.msgLayout.setPositionY(-45);
    }
};

About.prototype.ShowMsg = function() {
    this.show = true;
    
    this.msgLayout.setVisible(true);
	this.maskBkg.setVisible(true);
	
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Begin Timeline");
};

About.prototype.Hide = function(res) {
    this.show = false;
    
	this.rootNode.animationManager.runAnimationsForSequenceNamed("End Timeline");
};

About.prototype.onClickClose = function() {
	if ( !this.show ) {
		return ;	
	}
	
	this.Hide(0);
};

About.prototype.onAnimationComplete = function()
{
	var aniName = this.rootNode.animationManager.getLastCompletedSequenceName();
	if ( aniName == "End Timeline" ) {
		this.msgLayout.setVisible(false);
		this.maskBkg.setVisible(false);
	}	
}
    
