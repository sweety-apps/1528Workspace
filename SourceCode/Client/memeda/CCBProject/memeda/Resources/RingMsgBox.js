var RingMsgBox = function() {};

RingMsgBox.prototype.onDidLoadFromCCB = function () {
    // Do Scale
    var screenSize = cc.Director.getInstance().getWinSizeInPixels();
    var screenWidth = screenSize.width > screenSize.height ? screenSize.height : screenSize.width;
    var screenHeight = screenSize.width > screenSize.height ? screenSize.width : screenSize.height;

    // 针对非iphone5屏幕做缩小适配
    if(screenHeight / screenWidth < 1136/640)
    {   
        this.msgLayout.setScaleX(0.84);
        this.msgLayout.setScaleY(0.84);
        
        this.msgLayout.setPositionY(-50);
    }
};

RingMsgBox.prototype.ShowMsg = function(endFun) {
    this.show = true;

	this.maskBkg.setVisible(true);
	this.endFun = endFun;

	this.rootNode.animationManager.runAnimationsForSequenceNamed("Begin Timeline");
};

RingMsgBox.prototype.Hide = function(res) {
	this.show = false;
	
	this.rootNode.animationManager.runAnimationsForSequenceNamed("End Timeline");
	this.maskBkg.setVisible(false);
	this.endFun(res);
};

RingMsgBox.prototype.onClickClose = function() {
  	if ( !this.show ) {
		return ;	
	}
	cc.AudioEngine.getInstance().playEffect("sounds/Click_Wood_Cancel.mp3");
	this.Hide(0);
};

RingMsgBox.prototype.onClickOK = function() {
	// 扣金币
	if ( !this.show ) {
		return ;	
	}
	
	this.Hide(1);
};

RingMsgBox.prototype.onClickCancel = function() {
	// 扣金币
	if ( !this.show ) {
		return ;	
	}
  	cc.AudioEngine.getInstance().playEffect("sounds/Click_Wood_Cancel.mp3");
	this.Hide(0);
};