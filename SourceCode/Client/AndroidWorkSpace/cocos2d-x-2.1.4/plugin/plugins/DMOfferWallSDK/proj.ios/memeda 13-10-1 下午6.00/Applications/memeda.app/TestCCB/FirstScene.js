
var FirstScene = function() {};

FirstScene.prototype.onDidLoadFromCCB = function () {
    var scene = cc.BuilderReader.loadAsScene("GuessScene");
    var scene = cc.BuilderReader.loadAsScene("ChooseTestsScene");
    
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
		var director = cc.Director.getInstance();
    	var scene = cc.BuilderReader.loadAsScene("ChooseTestsScene");
    	var runningScene = director.getRunningScene();
    	if (runningScene === null) director.runWithScene(scene);
    	else director.replaceScene(scene);
	}
};
