
var FirstScene = function() {};
var gChooseTestsScene = null;

FirstScene.prototype.onDidLoadFromCCB = function () {
	cc.SpriteFrameCache.getInstance().addSpriteFrames("UI/firstscene.plist");
    cc.SpriteFrameCache.getInstance().addSpriteFrames("UI/common.plist");
    cc.SpriteFrameCache.getInstance().addSpriteFrames("UI/buy_coin_msgbox.plist");
    cc.SpriteFrameCache.getInstance().addSpriteFrames("UI/floors_doors.plist");
    cc.SpriteFrameCache.getInstance().addSpriteFrames("UI/floorsscene.plist");
    cc.SpriteFrameCache.getInstance().addSpriteFrames("UI/guess.plist");
	
    GuessScene_Preload(true);
    
	this.homePage.animationManager.setCompletedAnimationCallback(this, this.onAnimationComplete);
	
	//var chooseTestsScene = cc.BuilderReader.loadAsScene("ChooseTestsScene");
	//chooseTestsScene = null;
    
	//var GuessScene = cc.BuilderReader.loadAsScene("GuessScene");
	//GuessScene = null;

    Global_clearAllGloabalVars();
    
    GuessScene_Preload(false);
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
    	var runningScene = director.getRunningScene();
    	if (runningScene === null) director.runWithScene(chooseTestsScene);
    	else director.replaceScene(chooseTestsScene);
	}
};
