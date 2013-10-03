var BGLayer = function() {};

BGLayer.prototype.onDidLoadFromCCB = function () {
    var bgPrite = this.bgPrite;
    var bgDoor = this.doorPrite;
};

BGLayer.prototype.setBkg = function(bg, door) {
    var bgPrite = this.bgPrite;
    var bgDoor = this.doorPrite;

    var bgImage = "UI/guess/bg" + bg + ".png";
    var doorImage = "UI/guess/door" + door + ".png";

    var spriteFrame = cc.SpriteFrame.create(bgImage, cc.rect(0,0,380,568));
    bgPrite.setDisplayFrame(spriteFrame);

    spriteFrame = cc.SpriteFrame.create(doorImage, cc.rect(0,0,320,568));
    bgDoor.setDisplayFrame(spriteFrame);
    
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
