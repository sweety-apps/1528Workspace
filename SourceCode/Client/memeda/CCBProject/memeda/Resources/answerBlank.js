var AnswerBlank = function() {};

AnswerBlank.prototype.setImage = function(image) {
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Static" + image + " Timeline");	
	this.imageIndex = image;
};

AnswerBlank.prototype.setText = function(text) {
	if ( text != "" && text != this.getText() ) {
		this.rootNode.animationManager.runAnimationsForSequenceNamed("Show" + this.imageIndex + " Timeline");				
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