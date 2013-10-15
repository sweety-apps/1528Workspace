var AnswerBlank = function() {};
var imageIndex = 1;

AnswerBlank.prototype.setImage = function(image) {
	//this.rootNode.animationManager.runAnimationsForSequenceNamed("Static" + image + " Timeline");	
	imageIndex = image;
	debugMsgOutput("image " + image);
};

AnswerBlank.prototype.setText = function(text) {
	try {
		if ( text != "" && text != this.getText() ) {
			debugMsgOutput("Show" + imageIndex + " Timeline");
			this.rootNode.animationManager.runAnimationsForSequenceNamed("Show" + imageIndex + " Timeline");				
		} else {
			debugMsgOutput("Static" + imageIndex + " Timeline");
			this.rootNode.animationManager.runAnimationsForSequenceNamed("Static" + imageIndex + " Timeline");
		}
	} catch (e) {
	}
	
	this.labelText.setString(text);
}

AnswerBlank.prototype.getText = function() {
	return this.labelText.getString();
}

AnswerBlank.prototype.AttachClickEvent = function ( fun ) {
	this.ClickEvent = fun;	
}

AnswerBlank.prototype.onClick = function () {
	if ( this.ClickEvent != null ) {
		this.ClickEvent(this);	
	}	
}


AnswerBlank.prototype.SetIndexNumber = function (index) {
	this.numIndex = index;	
}

AnswerBlank.prototype.GetIndexNumber = function () {
	return this.numIndex;	
}

AnswerBlank.prototype.flush = function () {
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Error" + imageIndex + " Timeline");	
}

AnswerBlank.prototype.Hide = function () {
	this.rootLayout.setVisible(false);
	this.rootLayout.setScaleX(0);
    this.rootLayout.setScaleY(0);	
}

AnswerBlank.prototype.Show = function () {
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Visible" + imageIndex + " Timeline");	
	this.rootLayout.setVisible(true);
}

AnswerBlank.prototype.setNone = function () {
	this.rootNode.animationManager.runAnimationsForSequenceNamed("None Timeline");	
}