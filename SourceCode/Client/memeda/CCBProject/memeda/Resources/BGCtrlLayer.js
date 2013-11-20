var BGCtrlLayer = function() {};

BGCtrlLayer.prototype.onDidLoadFromCCB = function () {
    var screenSize = cc.Director.getInstance().getWinSizeInPixels();
    var screenWidth = screenSize.width > screenSize.height ? screenSize.height : screenSize.width;
    var screenHeight = screenSize.width > screenSize.height ? screenSize.width : screenSize.height;
    var scale = (screenHeight/screenWidth) / (568/320);
    if(screenHeight / screenWidth < 1136/640)
    {   
    	//this.bgPrite.setScaleX(0.84);
    	//this.bgPrite.setScaleY(0.84);
        this.bgPrite.setScaleX(scale);
        this.bgPrite.setScaleY(scale);
    }
};

BGCtrlLayer.prototype.setBkg = function(index) {
	this.rootNode.animationManager.runAnimationsForSequenceNamed("BG" + index + " Timeline");	
};
