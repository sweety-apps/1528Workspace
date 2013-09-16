var CatAni = function() {};

var gCatAniThis = null;
var gFunOnEnterCompleted = null;
var gFunOnEnterObj = null;

var gFunOnLeaveCompleted = null;
var gFunOnLeaveObj = null;

CatAni.prototype.onDidLoadFromCCB = function () {
	gCatAniThis = this;
	this.musicCtrl.setVisible(false);
	this.rootNode.animationManager.
		setCompletedAnimationCallback(this, this.onAnimationComplete);
		
    var screenSize = cc.Director.getInstance().getWinSizeInPixels();
    var screenWidth = screenSize.width > screenSize.height ? screenSize.height : screenSize.width;
    var screenHeight = screenSize.width > screenSize.height ? screenSize.width : screenSize.height;
    if(screenHeight / screenWidth < 1136/640)
    {   
    	this.bgLayout.setScaleX(0.84);
    	this.bgLayout.setScaleY(0.84);	
    }	
};

CatAni.prototype.Enter = function(fun, obj) {
	gFunOnEnterCompleted = fun;
	gFunOnEnterObj = obj;
	
	this.musicCtrl.setVisible(true);
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Enter Timeline");
};

CatAni.prototype.Leave = function(fun, obj) {
	gFunOnLeaveCompleted = fun;
	gFunOnLeaveObj = obj;
	
	this.musicCtrl.setVisible(false);
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Leave Timeline");
};

CatAni.prototype.onAnimationComplete = function() {
	var aniName = gCatAniThis.rootNode.animationManager.getLastCompletedSequenceName();
	if ( gFunOnEnterCompleted != null && aniName == "Enter Timeline" ) {
		gFunOnEnterCompleted(gFunOnEnterObj);
	} else if ( gFunOnLeaveCompleted != null && aniName == "Leave Timeline" ) {
		gFunOnLeaveCompleted(gFunOnLeaveObj);
	}
};

CatAni.prototype.Listen = function (listen) {
	// 
	this.musicCtrl.setVisible(listen);	
};