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
	
	this.replay.setVisible(false);
	this.isEnter = true;
	this.musicCtrl.setVisible(true);
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Enter Timeline");
};

CatAni.prototype.Leave = function(fun, obj) {
	gFunOnLeaveCompleted = fun;
	gFunOnLeaveObj = obj;
	
	this.replay.setVisible(false);
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


CatAni.prototype.onClickCat = function () {
    debugMsgOutput("CatAni.prototype.onClickCat");
	if ( this.isEnter && !this.replay.isVisible() ) {
		(this.clickCat)(this.context);	
	} else {
        this.clickFun (this.context);
    }
};

CatAni.prototype.Listen = function (listen) {
	// 
	if ( this.isEnter ) {
		this.musicCtrl.setVisible(listen);	
		if ( listen ) {
			this.replay.setVisible(false);
			this.rootNode.animationManager.runAnimationsForSequenceNamed("Listen Timeline");
			debugMsgOutput("----- Listen Timeline");
		} else {
			this.replay.setVisible(true);
			this.rootNode.animationManager.runAnimationsForSequenceNamed("Default Timeline");	
			debugMsgOutput("----- Default Timeline");
		}
	}
};

CatAni.prototype.onClickReplay = function () {
	this.clickFun (this.context);
};

CatAni.prototype.attachEvent = function ( obj , fun, clickCat) {
	this.context = obj;
	this.clickFun = fun;
	this.clickCat = clickCat;
};

CatAni.prototype.setStatus = function ( status ) {
	if ( this.isEnter ) {
		this.replay.setVisible(false);
		if ( status == -1 ) {
			this.rootNode.animationManager.runAnimationsForSequenceNamed("Listen Timeline");
		} else if ( status == 1 ) {
			this.rootNode.animationManager.runAnimationsForSequenceNamed("Happy Timeline");	
		} else if ( status == 2 ) {
			this.rootNode.animationManager.runAnimationsForSequenceNamed("Unpleasant Timeline");			
		} else if ( status == 3 ) {
			this.rootNode.animationManager.runAnimationsForSequenceNamed("Dreadful Timeline");
		} else if ( status == 4 ) {
			this.rootNode.animationManager.runAnimationsForSequenceNamed("Forceful Timeline");
		} else if ( status == 5 ) {
			this.rootNode.animationManager.runAnimationsForSequenceNamed("Weep Timeline");
		}
	}	
}