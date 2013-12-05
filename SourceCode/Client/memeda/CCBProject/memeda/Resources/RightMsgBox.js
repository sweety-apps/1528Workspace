var RightMsgBox = function() {};

RightMsgBox.prototype.onDidLoadFromCCB = function () {
    this.rootNode.animationManager.setCompletedAnimationCallback(this, this.onAnimationComplete);
};

RightMsgBox.prototype.onClickBkg = function () {
};

RightMsgBox.prototype.ShowMsg = function(id, lab, answerRight, url, isFirst, onClose, allRight) {
	this.show = true;
	this.isFirst = isFirst;
	this.onCloseFun = onClose;
	this.msgLayout.setVisible(true);
	this.Url = url;
	this.isAddCoin = false;
	this.allRight = allRight;
    this.searchkey = lab + " " + answerRight;
	this.coinAward.setVisible(isFirst);
	
    // 判断是否显示广告
    var bShowAd = false;
    if ( RemoteConfig.ad == "1" ) {
    	if ( (gAnswerRightNum % parseInt(RemoteConfig.adRate)) == 0 ) {
    		if ( gAnswerRightNum > gCurShowAdNum ) {
    			gCurShowAdNum = gAnswerRightNum;
    			var suc = memeda.common.presentAd();
                debugMsgOutput("suc " + suc);
                bShowAd = suc;
    		}
    	}
    }
    
		// 显示的链接长度不超过40个字符
		url = "《" + lab + "-" + answerRight + "》";
		if ( this.Url != null && this.Url != "" ) {
			url = url + this.Url;
		}
		
		if ( url.length >= 40 ) {
			url = url.substr(0, 37);
			url = url + "...";
		}
		this.aboutUrl.setString(url);
	
	try {
    	var image = "problem/pic/" + id + ".jpg";
        //var spriteFrame = null;
        //spriteFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame(image);
    	//this.image.setDisplayFrame(spriteFrame);
        UtilsFunctions_setSpriteImageWithName(this.image,image);
	} catch ( e ) {
	}
	
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Default Timeline");
};

RightMsgBox.prototype.onClickNext = function() {
	if ( this.allRight ) {
		var scene = cc.BuilderReader.loadAsScene("ChooseTestsScene.ccbi");
		scene = cc.TransitionFadeTR.create(0.4,scene);
		cc.Director.getInstance().replaceScene(scene);
		return ;	
	}
	this.Hide();
}

RightMsgBox.prototype.onClickURL = function() {
	if ( this.Url != null && this.Url != "" ) {
		memeda.common.openURL(this.Url);
	} else {
		var url = "http://m.baidu.com/ssid=0/from=0/bd_page_type=1/uid=0/baiduid=7C67E7660105AE7338E870BD5DE722AF/s?word=";
		url = url + encodeURI(this.searchkey);
		memeda.common.openURL(url);
		debugMsgOutput("... " + url);
	}
}

RightMsgBox.prototype.Hide = function () {
	if ( this.show ) {
        if ( this.isFirst && !this.isAddCoin ) {
			cc.AudioEngine.getInstance().playEffect("sounds/Click_Pay_Coins.mp3");
			CoinMgr_Change(3);
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
			CoinMgr_Change(3);
		}	
	}
}