var BGDoorLayer = function() {};

BGDoorLayer.prototype.onDidLoadFromCCB = function () {
    var screenSize = cc.Director.getInstance().getWinSizeInPixels();
    var screenWidth = screenSize.width > screenSize.height ? screenSize.height : screenSize.width;
    var screenHeight = screenSize.width > screenSize.height ? screenSize.width : screenSize.height;
    var scale = (screenHeight/screenWidth) / (568/320);
    if(screenHeight / screenWidth < 1136/640)
    {       	
     	//this.doorPrite.setScaleX(0.84);
    	//this.doorPrite.setScaleY(0.84);
        this.doorPrite.setScaleX(scale);
        this.doorPrite.setScaleY(scale);
    }
};

BGDoorLayer.prototype.setBkg = function(index) {
	this.rootNode.animationManager.runAnimationsForSequenceNamed("DOOR" + index + " Timeline");	
};
