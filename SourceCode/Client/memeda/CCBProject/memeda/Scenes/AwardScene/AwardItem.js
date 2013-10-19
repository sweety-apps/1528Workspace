var AwardItem = function() {};

AwardItem.prototype.setItemInfo = function (image, num, context, onClickFun) {
	
    var spriteFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame(image);
   	this.image.setDisplayFrame(spriteFrame);
   	if ( num != null ) {
   		this.num.setVisible(true);
    	this.num.setString("" + num);
   	} else {
   		this.num.setVisible(false);	
   	}
   	
   	this.context = context;
   	this.onClickFun = onClickFun;
}

AwardItem.prototype.setItemStatus = function (status) {
	if ( status == 0 ) {
		this.tip.setVisible(false);	
		//
		this.rootNode.animationManager.runAnimationsForSequenceNamed("Flush Timeline");
	} else {
		this.tip.setVisible(true);
		if ( status == 1 ) {
			var spriteFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame("UI/floorsscene/award_tip1.png");
   			this.tip.setDisplayFrame(spriteFrame);
   			this.rootNode.animationManager.runAnimationsForSequenceNamed("Flush Timeline");
		} else {	// 已领取
			var spriteFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame("UI/floorsscene/award_tip2.png");
   			this.tip.setDisplayFrame(spriteFrame);	
   			this.rootNode.animationManager.runAnimationsForSequenceNamed("Default Timeline");	
		}
	}
	
	this.Status = status;
}

AwardItem.prototype.onClick = function () {
	if ( this.Status != 2 ) {
		(this.onClickFun)(this.context);	
	}	
}