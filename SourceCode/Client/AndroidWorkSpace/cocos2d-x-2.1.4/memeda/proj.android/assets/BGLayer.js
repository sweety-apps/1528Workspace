var BGLayer = function() {};

BGLayer.prototype.onDidLoadFromCCB = function () {
    var screenSize = cc.Director.getInstance().getWinSizeInPixels();
    var screenWidth = screenSize.width > screenSize.height ? screenSize.height : screenSize.width;
    var screenHeight = screenSize.width > screenSize.height ? screenSize.width : screenSize.height;
    var scale = (screenHeight/screenWidth) / (568/320);
    if(screenHeight / screenWidth < 1136/640)
    {
    	//this.window.setScaleX(0.84);
    	//this.window.setScaleY(0.84);
        this.window.setScaleX(scale);
        this.window.setScaleY(scale);
    }
};

BGLayer.prototype.setBkg = function(bg, door) {
	this.bgCtrlLayer.controller.setBkg(bg);
	this.bgDoorLayer.controller.setBkg(door);
};

BGLayer.prototype.setPlay = function ( play ) {
	if ( play ) {
		this.rootNode.animationManager.runAnimationsForSequenceNamed("Play Timeline");	
	} else {
		this.rootNode.animationManager.runAnimationsForSequenceNamed("Default Timeline");	
	}	
};