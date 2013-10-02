var BGLayer = function() {};

BGLayer.prototype.onDidLoadFromCCB = function () {
    var bgPrite = this.bgPrite;
    var bgDoor = this.doorPrite;
};

BGLayer.prototype.setBkg = function(bg, door) {
    var bgPrite = this.bgPrite;
    var bgDoor = this.doorPrite;
    
    var screenSize = cc.Director.getInstance().getWinSizeInPixels();
    var screenWidth = screenSize.width > screenSize.height ? screenSize.height : screenSize.width;
    var screenHeight = screenSize.width > screenSize.height ? screenSize.width : screenSize.height;
    if(screenHeight / screenWidth < 1136/640)
    {   
    	this.bgPrite.setScaleX(0.84);
    	this.bgPrite.setScaleY(0.84);
    	    	
     	this.doorPrite.setScaleX(0.84);
    	this.doorPrite.setScaleY(0.84);
    }
};
