var BGDoorLayer = function() {};

BGDoorLayer.prototype.onDidLoadFromCCB = function () {
    var screenSize = cc.Director.getInstance().getWinSizeInPixels();
    var screenWidth = screenSize.width > screenSize.height ? screenSize.height : screenSize.width;
    var screenHeight = screenSize.width > screenSize.height ? screenSize.width : screenSize.height;
    if(screenHeight / screenWidth < 1136/640)
    {       	
     	this.doorPrite.setScaleX(0.84);
    	this.doorPrite.setScaleY(0.84);
    }
};

BGDoorLayer.prototype.setBkg = function(index) {
	this.rootNode.animationManager.runAnimationsForSequenceNamed("DOOR" + index + " Timeline");	
};
