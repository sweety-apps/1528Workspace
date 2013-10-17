var JumpMsgBox = function() {};

JumpMsgBox.prototype.onDidLoadFromCCB = function () {
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

JumpMsgBox.prototype.ShowMsg = function(price, id, endFun) { 
	this.maskBkg.setVisible(true);
	this.endFun = endFun;
	this.price = price;
	
	var num0 = Math.floor(price / 100);
	var num1 = Math.floor((price % 100) / 10);
	var num2 = price % 10;

    var image = "UI/guess/tip_" + num0 + ".png";
    var spriteFrame = cc.SpriteFrame.create(image, cc.rect(0,0,19,29));
    this.num0.setDisplayFrame(spriteFrame);
    
    image = "UI/guess/tip_" + num1 + ".png";
    spriteFrame = cc.SpriteFrame.create(image, cc.rect(0,0,19,29));
    this.num1.setDisplayFrame(spriteFrame);
	
	image = "UI/guess/tip_" + num2 + ".png";
    spriteFrame = cc.SpriteFrame.create(image, cc.rect(0,0,19,29));
    this.num2.setDisplayFrame(spriteFrame);
        
 	if ( !Global_isWeb() ) {
     	var param = memeda.Stat.createParam();
    	param.addKeyAndValue("aid", ""+id);
    	memeda.Stat.logEvent("clickJump", param);
	}
				
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Begin Timeline");
};

JumpMsgBox.prototype.Hide = function(res) {
	this.rootNode.animationManager.runAnimationsForSequenceNamed("End Timeline");
	this.maskBkg.setVisible(false);
	this.endFun(res);
};

JumpMsgBox.prototype.onClickClose = function() {
    cc.AudioEngine.getInstance().playEffect("sounds/Click_Wood_Cancel.mp3");
	this.Hide(0);
};

JumpMsgBox.prototype.onClickBuy = function() {
	// 扣金币
	if ( CoinMgr_GetCount() < this.price ) {
		// 金币不够
		this.noEnoughEvent(2);
        cc.AudioEngine.getInstance().playEffect("sounds/WrongAnswer.mp3");
		this.Hide(0);
		
 		if ( !Global_isWeb() ) {
    		memeda.Stat.logEvent("clickJumpNoEnough");
		}
	} else {
		CoinMgr_Change(-1 * this.price);
        cc.AudioEngine.getInstance().playEffect("sounds/Click_Pay_Coins.mp3");
		// 加入到跳过题目的列表
		this.Hide(1);
 		if ( !Global_isWeb() ) {
    		memeda.Stat.logEvent("clickJumpBuy");
		}
	}
};