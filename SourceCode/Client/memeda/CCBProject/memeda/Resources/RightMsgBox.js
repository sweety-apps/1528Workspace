var RightMsgBox = function() {};

RightMsgBox.prototype.onDidLoadFromCCB = function () {
    this.rootNode.animationManager.setCompletedAnimationCallback(this, this.onAnimationComplete);
};

RightMsgBox.prototype.ShowMsg = function(id, url, onClose) {
	this.onCloseFun = onClose;
	this.msgLayout.setVisible(true);
	this.Url = url;
	
	if ( url != null ) {
		// 显示的链接长度不超过40个字符
		if ( url.length >= 40 ) {
			url = url.substr(0, 37);
			url = url + "...";
		}
		this.aboutUrl.setString(url);
	} else {
		this.aboutUrl.setString("");
	}
	
    var image = "problem/pic/" + id + ".jpg";
    var spriteFrame = cc.SpriteFrame.create(image, cc.rect(0,0,195,135));
    this.image.setDisplayFrame(spriteFrame);
	
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Default Timeline");
};

RightMsgBox.prototype.onClickNext = function() {
	this.Hide();
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
		if ( this.onCloseFun != null ) {
			this.onCloseFun();
		}
	}
}