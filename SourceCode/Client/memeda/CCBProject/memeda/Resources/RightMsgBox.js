var RightMsgBox = function() {};

RightMsgBox.prototype.onDidLoadFromCCB = function () {
    this.rootNode.animationManager.setCompletedAnimationCallback(this, this.onAnimationComplete);
};

RightMsgBox.prototype.onClickBkg = function () {
};

RightMsgBox.prototype.ShowMsg = function(id, url, isFirst, onClose) {
	this.show = true;
	this.isFirst = isFirst;
	this.onCloseFun = onClose;
	this.msgLayout.setVisible(true);
	this.Url = url;
	this.isAddCoin = false;
    
	this.coinAward.setVisible(isFirst);
	
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
        if ( this.isFirst && !this.isAddCoin ) {
			cc.AudioEngine.getInstance().playEffect("sounds/Click_Pay_Coins.mp3");
			CoinMgr_Change(5);
        }
       
		this.show = false;
		
		if ( this.isFirst ) {
			this.rootNode.animationManager.runAnimationsForSequenceNamed("CoinHide Timeline");
		} else {
			this.rootNode.animationManager.runAnimationsForSequenceNamed("Hide Timeline");		
		}	
	}
}

RightMsgBox.prototype.onAnimationComplete = function() {
	if ( this.rootNode.animationManager.getLastCompletedSequenceName() == "Hide Timeline" ) {
		this.msgLayout.setVisible(false);	
		if ( this.onCloseFun != null ) {
			this.onCloseFun();
		}
	} else if ( this.rootNode.animationManager.getLastCompletedSequenceName() == "Default Timeline" ) {
		if ( this.isFirst ) {
            this.isAddCoin = true;
			cc.AudioEngine.getInstance().playEffect("sounds/Click_Pay_Coins.mp3");
            debugMsgOutput("this.rootNode.animationManager.runAnimationsForSequenceNamed('CoinShow Timeline')");
			//this.rootNode.animationManager.runAnimationsForSequenceNamed("CoinShow Timeline");		
			CoinMgr_Change(5);
		}	
	}
}