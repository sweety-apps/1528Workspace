var BGLayer = function() {};

BGLayer.prototype.onDidLoadFromCCB = function () {
    var bgPrite = this.bgPrite;
    var bgDoor = this.doorPrite;
};

BGLayer.prototype.setBkg = function(bg, door) {
    var bgPrite = this.bgPrite;
    var bgDoor = this.doorPrite;

    var bgImage = "UI/guess/bg" + bg + ".png";
    var doorImage = "UI/guess/door" + door + ".png";

    var spriteFrame = cc.SpriteFrame.create(bgImage, cc.rect(0,0,320,568));
    bgPrite.setDisplayFrame(spriteFrame);

    spriteFrame = cc.SpriteFrame.create(doorImage, cc.rect(0,0,320,568));
    bgDoor.setDisplayFrame(spriteFrame);
};
