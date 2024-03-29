var BuyMsg = function() {};
var gBuyMsgThis = null;


BuyMsg.prototype.onClickBkg = function () {
	
};

BuyMsg.prototype.onDidLoadFromCCB = function () {
	gBuyMsgThis = this;
	
	this.rootNode.animationManager.setCompletedAnimationCallback(this, this.onAnimationComplete);
	
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

BuyMsg.prototype.ShowMsg = function(price, msg, endFun, index) {
	// 显示购买消息
    // 上报数据
    this.show = true;
    
    if ( !Global_isWeb() ) {
    	var param = memeda.Stat.createParam();
    	param.addKeyAndValue("num", ""+index);
        param.addKeyAndValue("question", gProblemProject);
        
    	memeda.Stat.logEvent("promptclick", param);
    }
    //
    
    this.msgLayout.setVisible(true);
	this.maskBkg.setVisible(true);
	this.endFun = endFun;
	this.price = price;
    this.index = index;
	
	var num1 = Math.floor(price / 100);
	var num2 = Math.floor( (price % 100) / 10 );
	var num3 = price % 10;

	this.num1.setVisible(true);
	this.num2.setVisible(true);
	
	if ( num1 == 0 ) {
	    var image = "UI/common/tip_" + num2 + ".png";
	    //var spriteFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame(image);
	    //this.num1.setDisplayFrame(spriteFrame);
	    UtilsFunctions_setSpriteImageWithName(this.num1,image);
		
		image = "UI/common/tip_" + num3 + ".png";
	    //spriteFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame(image);
	    //this.num2.setDisplayFrame(spriteFrame);
	    UtilsFunctions_setSpriteImageWithName(this.num2,image);	
	    
	    this.num3.setVisible(false);
	} else {
	    var image = "UI/common/tip_" + num1 + ".png";
	    //var spriteFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame(image);
	    //this.num1.setDisplayFrame(spriteFrame);
	    UtilsFunctions_setSpriteImageWithName(this.num1,image);
		
		image = "UI/common/tip_" + num2 + ".png";
	    //spriteFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame(image);
	    //this.num2.setDisplayFrame(spriteFrame);
	    UtilsFunctions_setSpriteImageWithName(this.num2,image);	
	    
		image = "UI/common/tip_" + num3 + ".png";
	    //spriteFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame(image);
	    //this.num2.setDisplayFrame(spriteFrame);
	    UtilsFunctions_setSpriteImageWithName(this.num3,image);	
	       
		this.num3.setVisible(true);
	}
    
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Begin Timeline");
};

BuyMsg.prototype.Hide = function(res) {
    this.show = false;
    
	this.rootNode.animationManager.runAnimationsForSequenceNamed("End Timeline");
	this.maskBkg.setVisible(false);
	this.endFun(res);
};

BuyMsg.prototype.onClickClose = function() {
	if ( !this.show ) {
		return ;	
	}
	
	this.Hide(0);
    
    // 上报数据
    if ( !Global_isWeb() ) {
    	var param = memeda.Stat.createParam();
    	param.addKeyAndValue("num", ""+this.index);
        param.addKeyAndValue("question", gProblemProject);
    	memeda.Stat.logEvent("promptclose", param);
    }
    //
};

BuyMsg.prototype.onAnimationComplete = function()
{
	var aniName = this.rootNode.animationManager.getLastCompletedSequenceName();
	if ( aniName == "End Timeline" ) {
		this.msgLayout.setVisible(false);
	}	
}
    
    
BuyMsg.prototype.onClickBuy = function() {
	// 扣金币
	if ( !this.show ) {
		return ;	
	}
	
	if ( CoinMgr_GetCount() < this.price ) {
		// 金币不够
		this.noEnoughEvent(1);
        cc.AudioEngine.getInstance().playEffect("sounds/WrongAnswer.mp3");
		this.Hide(0);
		
 		if ( !Global_isWeb() ) {
            var param = memeda.Stat.createParam();
            param.addKeyAndValue("question", gProblemProject);
    		memeda.Stat.logEvent("clickBuyNoEnough", param);
		}
	} else {
		debugMsgOutput("BuyMsg.prototype.onClickBuy");
    	// 上报数据
    	if ( !Global_isWeb() ) {
    		var param = memeda.Stat.createParam();
    		param.addKeyAndValue("num", ""+this.index);
            param.addKeyAndValue("question", gProblemProject);
    		memeda.Stat.logEvent("promptbuy", param);
    	}
    	//
        cc.AudioEngine.getInstance().playEffect("sounds/Click_Pay_Coins.mp3");
		CoinMgr_Change(-1 * this.price);
		this.Hide(1);
		debugMsgOutput("BuyMsg.prototype.onClickBuy end");
	}	
};