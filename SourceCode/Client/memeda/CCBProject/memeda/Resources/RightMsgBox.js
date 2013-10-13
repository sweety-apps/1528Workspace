var RightMsgBox = function() {};

RightMsgBox.prototype.onDidLoadFromCCB = function () {
    this.rootNode.animationManager.setCompletedAnimationCallback(this, this.onAnimationComplete);
};

RightMsgBox.prototype.onClickBkg = function () {
};

RightMsgBox.prototype.ShowMsg = function(id, url, onClose) {
	this.show = true;
	this.onCloseFun = onClose;
	this.msgLayout.setVisible(true);
	this.Url = url;
	
	if ( url != null && url != "" ) {
		// 显示的链接长度不超过40个字符
		if ( url.length >= 40 ) {
			url = url.substr(0, 37);
			url = url + "...";
		}
		this.aboutUrl.setString(url);
	} else {
		this.aboutUrl.setString("");
	}
	
	try {
    	var image = "problem/pic/" + id + ".jpg";
    	var spriteFrame = cc.SpriteFrame.create(image, cc.rect(0,0,195,135));
    	this.image.setDisplayFrame(spriteFrame);
	} catch ( e ) {
	}
	
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Default Timeline");
};

RightMsgBox.prototype.onClickNext = function() {
	this.Hide();
}

RightMsgBox.prototype.onClickURL = function() {
	if ( this.Url != null && this.Url != "" ) {
		memeda.common.openURL(this.Url);
	}
}

RightMsgBox.prototype.Hide = function () {
	if ( this.show ) {
		this.show = false;
		this.rootNode.animationManager.runAnimationsForSequenceNamed("Hide Timeline");	
	}
}

RightMsgBox.prototype.onAnimationComplete = function() {
	if ( this.rootNode.animationManager.getLastCompletedSequenceName() == "Hide Timeline" ) {
		this.msgLayout.setVisible(false);	
		if ( this.onCloseFun != null ) {
			this.onCloseFun();
		}
	}
}