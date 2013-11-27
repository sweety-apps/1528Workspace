var TaskTip = function() {};

TaskTip.prototype.onDidLoadFromCCB = function () {
    this.rootNode.animationManager.setCompletedAnimationCallback(this, this.onAnimationComplete);
    this.isHide = false;

    var screenSize = cc.Director.getInstance().getWinSizeInPixels();
    var screenWidth = screenSize.width > screenSize.height ? screenSize.height : screenSize.width;
    var screenHeight = screenSize.width > screenSize.height ? screenSize.width : screenSize.height;
    if(screenHeight / screenWidth > 960/640) {
        if(sys.os == "ios")
        {
            this.taskTip5.setVisible(true);
            this.taskTip4.setVisible(false);
        }
        else
        {
            this.taskTip4.setVisible(true);
            this.taskTip5.setVisible(false);
            var scale = (screenHeight/screenWidth) / (480/320);
            cc.log("Test Come Here");
            this.taskTipLayout.setScaleX(scale);
            this.taskTipLayout.setScaleY(scale);
            //this.taskTip4.setScaleX(2.0);
            //this.taskTip4.setScaleY(2.0);
        }
    } else {
        this.taskTip5.setVisible(false);
        this.taskTip4.setVisible(true);
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