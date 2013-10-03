var AnswerBlank = function() {};
var imageIndex = 1;

AnswerBlank.prototype.setImage = function(image) {
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Static" + image + " Timeline");	
	imageIndex = image;
};

AnswerBlank.prototype.setText = function(text) {
	try {
		if ( text != "" && text != this.getText() ) {
			this.rootNode.animationManager.runAnimationsForSequenceNamed("Show" + imageIndex + " Timeline");				
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

AnswerBlank.prototype.error = function () {
	this.rootNode.animationManager.runAnimationsForSequenceNamed("Error" + imageIndex + " Timeline");	
}