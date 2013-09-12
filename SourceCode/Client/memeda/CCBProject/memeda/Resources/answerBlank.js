var answerBlank = function() {};

answerBlank.prototype.setImage = function(image) {
    var charBG = this.charBG;
    var bgImage1 = "UI/guess/answerButtonNormal" + image + ".png";

    var spriteFrame = cc.SpriteFrame.create(bgImage1, cc.rect(0,0,55,55));
    charBG.setDisplayFrame(spriteFrame);
};
