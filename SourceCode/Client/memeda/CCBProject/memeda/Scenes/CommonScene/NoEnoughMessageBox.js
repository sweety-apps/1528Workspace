var NoEnoughMessageBox = function() {};


NoEnoughMessageBox.prototype.onDidLoadFromCCB = function () {
    // Do Scale
    this.rootNode.animationManager.setCompletedAnimationCallback(this, this.onAnimationComplete);
    
    var screenSize = cc.Director.getInstance().getWinSizeInPixels();
    var screenWidth = screenSize.width > screenSize.height ? screenSize.height : screenSize.width;
    var screenHeight = screenSize.width > screenSize.height ? screenSize.width : screenSize.height;

	this.msgLayout.setVisible(false);
	
    // 针对非iphone5屏幕做缩小适配
    if(screenHeight / screenWidth < 1136/640)
    {   
        this.msgLayout.setScaleX(0.84);
        this.msgLayout.setScaleY(0.84);
        
        this.msgLayout.setPositionY(-50);
    }
};

NoEnoughMessageBox.prototype.show = function(src, endFun) {
	if ( RemoteConfig.domob == "1" || sys.os == "android" || sys.os == "Android" ) {
		if ( sys.os == "android" || sys.os == "Android" ) {
			// 只显示免费金币	
			this.freeBtnText.setVisible(true);
			this.freeBtn.setVisible(true);	
			this.buyBtn.setVisible(false);
			this.buyBtnText.setVisible(false);		
			
			this.freeBtn.setPositionY(182);
			this.freeBtnText.setPositionY(184);			
		} else {
			this.freeBtnText.setVisible(true);
			this.freeBtn.setVisible(true);	
		
			this.buyBtn.setPositionY(259);
			this.buyBtnText.setPositionY(261);	
		}	
	} else {
		this.freeBtnText.setVisible(false);
		this.freeBtn.setVisible(false);
		
		this.buyBtn.setPositionY(182);
		this.buyBtnText.setPositionY(184);	
	}
	
	this.msgLayout.setVisible(true);
	this.maskBkg.setVisible(true);
	this.endFun = endFun;
	this.src = src;
	
	this.bkgBtn.setVisible(true);

	this.rootNode.animationManager.runAnimationsForSequenceNamed("Begin Timeline");
};

NoEnoughMessageBox.prototype.onAnimationComplete = function () {
	var name = this.rootNode.animationManager.getLastCompletedSequenceName();
	if ( name == "End Timeline" ) {
		this.msgLayout.setVisible(false);		
	}
}

NoEnoughMessageBox.prototype.onClickBkg = function () {
};

NoEnoughMessageBox.prototype.Hide = function(res) {
	this.bkgBtn.setVisible(false);
	this.rootNode.animationManager.runAnimationsForSequenceNamed("End Timeline");
	this.maskBkg.setVisible(false);
	this.endFun(res);
};

NoEnoughMessageBox.prototype.onClickClose = function() {
	this.Hide(0);
};


NoEnoughMessageBox.prototype.onClickBuy = function() {
 	if ( !Global_isWeb() ) {
        var param = memeda.Stat.createParam();
    	param.addKeyAndValue("question", gProblemProject);
    	memeda.Stat.logEvent("showBuyCoinScene" + this.src, param);
	}
		
	this.Hide(1);	
};

NoEnoughMessageBox.prototype.onClickFree = function () {
 	if ( !Global_isWeb() ) {
        var param = memeda.Stat.createParam();
        param.addKeyAndValue("question", gProblemProject);
        param.addKeyAndValue("src", "guess");
    	memeda.Stat.logEvent("clickDuomeng", param);
	}
		
	this.Hide(2);	
};