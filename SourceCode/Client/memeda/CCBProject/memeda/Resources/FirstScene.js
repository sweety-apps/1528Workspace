
var FirstScene = function() {};
var gChooseTestsScene = null;

FirstScene.prototype.onDidLoadFromCCB = function () {

	//cc.SpriteFrameCache.getInstance().addSpriteFrames("UI/firstscene.plist");
	//cc.SpriteFrameCache.getInstance().addSpriteFrames("UI/firstscene2.plist");
		
  //GuessScene_Preload(true);
    
	this.homePage.animationManager.setCompletedAnimationCallback(this, this.onAnimationComplete);
	
	//var chooseTestsScene = cc.BuilderReader.loadAsScene("ChooseTestsScene");
	//chooseTestsScene = null;
    
	//var GuessScene = cc.BuilderReader.loadAsScene("GuessScene");
	//GuessScene = null;

    Global_clearAllGloabalVars();
    
    //GuessScene_Preload(false);
    
    cc.AudioEngine.getInstance().playMusic("sounds/Floor_BG.mp3",true);
    cc.AudioEngine.getInstance().setMusicVolume(0.5);

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
		
		var director = cc.Director.getInstance();
    	director.replaceScene(chooseTestsScene);
        
        //cc.SpriteFrameCache.getInstance().removeSpriteFramesFromFile("UI/firstscene.plist");
        //cc.SpriteFrameCache.getInstance().removeSpriteFramesFromFile("UI/firstscene2.plist");
	}
};
