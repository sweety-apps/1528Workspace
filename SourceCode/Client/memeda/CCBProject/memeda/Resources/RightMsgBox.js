var RightMsgBox = function() {};

RightMsgBox.prototype.onDidLoadFromCCB = function () {
    this.rootNode.animationManager.setCompletedAnimationCallback(this, this.onAnimationComplete);
};

RightMsgBox.prototype.ShowMsg = function(url, onClose) {
	this.onCloseFun = onClose;
	this.msgLayout.setVisible(true);
	this.Url = url;
	this.aboutUrl.setString(url);
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Default Timeline");
};

RightMsgBox.prototype.onClickNext = function() {
	this.onCloseFun();	
}

RightMsgBox.prototype.onClickURL = function() {
	
}

RightMsgBox.prototype.Hide = function () {
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Hide Timeline");	
}

RightMsgBox.prototype.onAnimationComplete = function() {
	if ( this.rootNode.animationManager.getLastCompletedSequenceName() == "Hide Timeline" ) {
		this.msgLayout.setVisible(false);	
	}
}