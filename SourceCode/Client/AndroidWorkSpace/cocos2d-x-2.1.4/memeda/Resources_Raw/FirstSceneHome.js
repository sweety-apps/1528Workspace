
var FirstSceneHome = function() {};

FirstSceneHome.prototype.onDidLoadFromCCB = function () {
    // Do Scale
    var screenSize = cc.Director.getInstance().getWinSizeInPixels();

    debugMsgOutput("screen size ("+screenSize.width+","+screenSize.height+")");

    var screenWidth = screenSize.width > screenSize.height ? screenSize.height : screenSize.width;
    var screenHeight = screenSize.width > screenSize.height ? screenSize.width : screenSize.height;

    // 针对非iphone5屏幕做缩小适配
    //if(screenHeight / screenWidth < 1136/640)
    //{
    	var size = cc.size(320, 480);
        size.height = 320*(screenHeight/screenWidth);
    	this.cloudLayout.setContentSize(size);
    	
    	this.utfLayout.setContentSize(size);
    //}
};