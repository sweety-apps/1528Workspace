var RightMsgBox = function() {};

RightMsgBox.prototype.onDidLoadFromCCB = function () {
    this.rootNode.animationManager.setCompletedAnimationCallback(this, this.onAnimationComplete);
};

RightMsgBox.prototype.ShowMsg = function(url, onClose) {
	this.onCloseFun = onClose;
	this.msgLayout.setVisible(true);
	this.Url = url;
	// 显示的链接长度不超过40个字符
	if ( url.length >= 40 ) {
		url = url.substr(0, 37);
		url = url + "...";
	}
	this.aboutUrl.setString(url);
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Default Timeline");
};

RightMsgBox.prototype.onClickNext = function() {
	this.onCloseFun();	
}

RightMsgBox.prototype.onClickURL = function() {
	memeda.common.openURL(this.Url);
}

RightMsgBox.prototype.Hide = function () {
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Hide Timeline");	
}

RightMsgBox.prototype.onAnimationComplete = function() {
	if ( this.rootNode.animationManager.getLastCompletedSequenceName() == "Hide Timeline" ) {
		this.msgLayout.setVisible(false);	
	}
}