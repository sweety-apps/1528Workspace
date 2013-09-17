var RightMsgBox = function() {};
var gRightMsgBoxThis = null;

RightMsgBox.prototype.onDidLoadFromCCB = function () {
	gRightMsgBoxThis = this;
    this.rootNode.animationManager.setCompletedAnimationCallback(this, this.onAnimationComplete);
};

RightMsgBox.prototype.ShowMsg = function(onClose) {
	this.onCloseFun = onClose;
	this.rootLayout.setVisible(true);
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Default Timeline");
};

RightMsgBox.prototype.onClickNext = function() {
	this.onCloseFun();	
}

RightMsgBox.prototype.Hide = function () {
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Hide Timeline");	
}

RightMsgBox.prototype.onAnimationComplete = function() {
	if ( gRightMsgBoxThis.rootNode.animationManager.getLastCompletedSequenceName() == "Hide Timeline" ) {
		gRightMsgBoxThis.rootLayout.setVisible(false);	
	}
}