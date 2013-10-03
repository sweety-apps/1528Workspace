
var FirstScene = function() {};
var gChooseTestsScene = null;

FirstScene.prototype.onDidLoadFromCCB = function () {  
	this.homePage.animationManager.setCompletedAnimationCallback(this, this.onAnimationComplete);
};

FirstScene.prototype.onClickStart = function () {
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Switch Timeline");	
	this.homePage.animationManager.runAnimationsForSequenceNamed("Ani Timeline");	
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
