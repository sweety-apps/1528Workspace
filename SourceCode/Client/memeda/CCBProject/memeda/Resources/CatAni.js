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
	debugMsgOutput("CatAni.prototype.Enter");
	gFunOnEnterCompleted = fun;
	gFunOnEnterObj = obj;
	
	this.isEnter = true;
	this.musicCtrl.setVisible(true);
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Enter Timeline");
};

CatAni.prototype.Leave = function(fun, obj) {
	gFunOnLeaveCompleted = fun;
	gFunOnLeaveObj = obj;
	
	this.isEnter = false;
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
	if ( this.isEnter ) {
		this.musicCtrl.setVisible(listen);	
		if ( listen ) {
			this.rootNode.animationManager.runAnimationsForSequenceNamed("Listen Timeline");
			debugMsgOutput("----- Listen Timeline");
		} else {
			this.rootNode.animationManager.runAnimationsForSequenceNamed("Default Timeline");	
			debugMsgOutput("----- Default Timeline");
		}
	}
};

CatAni.prototype.setStatus = function ( status ) {
	if ( this.isEnter ) {
		if ( status == -1 ) {
			this.rootNode.animationManager.runAnimationsForSequenceNamed("Listen Timeline");
		} else if ( status == 1 ) {
			this.rootNode.animationManager.runAnimationsForSequenceNamed("Happy Timeline");	
		} else if ( status == 2 ) {
			this.rootNode.animationManager.runAnimationsForSequenceNamed("Unpleasant Timeline");			
		} else if ( status == 3 ) {
			this.rootNode.animationManager.runAnimationsForSequenceNamed("Unpleasant Timeline");	// TODO
		} else if ( status == 4 ) {
			this.rootNode.animationManager.runAnimationsForSequenceNamed("Happy Timeline");			// TODO
		} else if ( status == 5 ) {
			this.rootNode.animationManager.runAnimationsForSequenceNamed("Unpleasant Timeline");	// TODO
		}
	}	
}