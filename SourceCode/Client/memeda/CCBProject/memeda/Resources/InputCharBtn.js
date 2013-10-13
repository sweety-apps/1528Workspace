var InputCharBtn = function() {};

InputCharBtn.prototype.onDidLoadFromCCB = function () {
	this.onAnimationComplete = function () {
		var aniName = this.rootNode.animationManager.getLastCompletedSequenceName();
		if ( aniName == "Hide Timeline" ) {
			this.rootLayout.setVisible(false);
		}
	};
	this.rootNode.animationManager.setCompletedAnimationCallback(this, this.onAnimationComplete);
}

InputCharBtn.prototype.setText = function(text) {
	this.labelText.setString(text);
}

InputCharBtn.prototype.getText = function() {
	return this.labelText.getString();
}

InputCharBtn.prototype.AttachClickEvent = function ( fun ) {
	this.ClickEvent = fun;	
}

InputCharBtn.prototype.onClick = function () {
	if ( this.ClickEvent != null ) {
		this.ClickEvent(this);	
	}	
}

InputCharBtn.prototype.setEnable = function ( enable ) {
	this.btn.setEnabled(status);	// 设置按钮点击状态
}

InputCharBtn.prototype.setStatus = function ( status ) {
	this.btn.setEnabled(status);	// 设置按钮点击状态	
	if ( status ) {
		this.rootNode.animationManager.runAnimationsForSequenceNamed("Show Timeline");	
	} else {
		this.rootNode.animationManager.runAnimationsForSequenceNamed("None Timeline");	
	}
}

InputCharBtn.prototype.SetIndexNumber = function (index) {
	this.numIndex = index;	
}

InputCharBtn.prototype.GetIndexNumber = function () {
	return this.numIndex;	
}

InputCharBtn.prototype.isShow = function (  ) {
	debugMsgOutput("isShow " + this.getText() + "  " + this.rootLayout.isVisible());
	return this.rootLayout.isVisible();
}


InputCharBtn.prototype.show = function ( show ) {
	if ( show ) {
		this.rootLayout.setVisible ( true );	
	} else {
		this.rootNode.animationManager.runAnimationsForSequenceNamed("Hide Timeline");	
	}	
}