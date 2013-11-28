
cc.COCOS2D_DEBUG = 0;

var FirstScene = function() {};
var gChooseTestsScene = null;


var debugTimeArray = new Array();
function debugTimeBgin(head) {
    var time = new Date();
    debugTimeArray["" + head] = time.getSeconds() * 1000 + time.getMilliseconds();
    
    debugMsgOutput(head + " begin");
}

function debugTimeEnd(head) {
    var time = new Date();
    
    var diff = time.getSeconds() * 1000 + time.getMilliseconds() - debugTimeArray["" + head];
    
    debugMsgOutput(head + " end " + diff);
}

FirstScene.prototype.onDidLoadFromCCB = function () {

	//cc.SpriteFrameCache.getInstance().addSpriteFrames("UI/firstscene.plist");
	//cc.SpriteFrameCache.getInstance().addSpriteFrames("UI/firstscene2.plist");
		
  	//GuessScene_Preload(true);
    Key_setCurrentScene(this);
    this.clickStart = false;
	this.homePage.animationManager.setCompletedAnimationCallback(this, this.onAnimationComplete);
	
    //debugTimeBgin("loadAsScene");
    
	//var chooseTestsScene = cc.BuilderReader.loadAsScene("ChooseTestsScene");
	//chooseTestsScene = null;
    
	//var GuessScene = cc.BuilderReader.loadAsScene("GuessScene");
	//GuessScene = null;

    //debugTimeEnd("loadAsScene");
    
    Global_clearAllGloabalVars();
    
    //GuessScene_Preload(false);
    
    cc.AudioEngine.getInstance().playMusic("sounds/Floor_BG.mp3",true);
    cc.AudioEngine.getInstance().setMusicVolume(0.5);
    
    var screenSize = cc.Director.getInstance().getWinSizeInPixels();
    var screenWidth = screenSize.width > screenSize.height ? screenSize.height : screenSize.width;
    var screenHeight = screenSize.width > screenSize.height ? screenSize.width : screenSize.height;
    if(screenHeight / screenWidth < 1136/640)
    {   
    	this.subLayout.setScaleX(0.88);
    	this.subLayout.setScaleY(0.88);
    	
    	this.subLayout.setPositionY(-60);
    	
    	this.cat2Layout.setPositionX(10);
    	this.cat2Layout.setPositionY(-30);

    	this.cat1Layout.setPositionX(-20);
    	this.cat1Layout.setPositionY(20);
    	
    	this.cat2.setScaleX(0.9);
    	this.cat2.setScaleY(0.9);
    	
    	this.about.setPositionY(454);
    	this.about.setScaleX(0.9);
    	this.about.setScaleY(0.9);
    }
};

FirstScene.prototype.onClickStart = function () {
    cc.AudioEngine.getInstance().playEffect("sounds/Click_Button.mp3");
    
	this.page2.setVisible(true);
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Switch Timeline");
	this.homePage.animationManager.runAnimationsForSequenceNamed("Ani Timeline");
	this.clickStart = true;
	this.btn.setVisible(false);
};


FirstScene.prototype.onAnimationComplete = function()
{
	var aniName = this.homePage.animationManager.getLastCompletedSequenceName();
	if ( aniName == "Ani Timeline" ) {
    debugTimeBgin("loadAsScene");
        
		var chooseTestsScene = cc.BuilderReader.loadAsScene("ChooseTestsScene");
    debugTimeEnd("loadAsScene");
        
    	chooseTestsScene = cc.TransitionFade.create(0.2,chooseTestsScene);
    	cc.Director.getInstance().replaceScene(chooseTestsScene);
        
        //cc.SpriteFrameCache.getInstance().removeSpriteFramesFromFile("UI/firstscene.plist");
        //cc.SpriteFrameCache.getInstance().removeSpriteFramesFromFile("UI/firstscene2.plist");
	}
};

FirstScene.prototype.onClickAbout = function () {
	this.aboutCtrl.controller.ShowMsg();
};

FirstScene.prototype.Key_onBackClicked = function() {
	if ( !this.clickStart ) {
		this.exitMsg.controller.ShowMsg();
	}
};