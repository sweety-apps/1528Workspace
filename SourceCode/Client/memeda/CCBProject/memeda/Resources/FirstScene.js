
var FirstScene = function() {};
var gChooseTestsScene = null;

FirstScene.prototype.onDidLoadFromCCB = function () {

	//cc.SpriteFrameCache.getInstance().addSpriteFrames("UI/firstscene.plist");
	//cc.SpriteFrameCache.getInstance().addSpriteFrames("UI/firstscene2.plist");
		
  	GuessScene_Preload(true);
    
	this.homePage.animationManager.setCompletedAnimationCallback(this, this.onAnimationComplete);
	
	var chooseTestsScene = cc.BuilderReader.loadAsScene("ChooseTestsScene");
	chooseTestsScene = null;
    
	var GuessScene = cc.BuilderReader.loadAsScene("GuessScene");
	GuessScene = null;

    Global_clearAllGloabalVars();
    
    GuessScene_Preload(false);
    
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
    }
};

FirstScene.prototype.onClickStart = function () {
    cc.AudioEngine.getInstance().playEffect("sounds/Click_Button.mp3");
    
	this.page2.setVisible(true);
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Switch Timeline");
	this.homePage.animationManager.runAnimationsForSequenceNamed("Ani Timeline");
	
	this.btn.setVisible(false);
};


FirstScene.prototype.onAnimationComplete = function()
{
	var aniName = this.homePage.animationManager.getLastCompletedSequenceName();
	if ( aniName == "Ani Timeline" ) {
		var chooseTestsScene = cc.BuilderReader.loadAsScene("ChooseTestsScene");
		
    	chooseTestsScene = cc.TransitionFade.create(0.2,chooseTestsScene);
    	cc.Director.getInstance().replaceScene(chooseTestsScene);
        
        //cc.SpriteFrameCache.getInstance().removeSpriteFramesFromFile("UI/firstscene.plist");
        //cc.SpriteFrameCache.getInstance().removeSpriteFramesFromFile("UI/firstscene2.plist");
	}
};
