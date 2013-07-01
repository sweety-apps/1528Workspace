//
// MainScene class
//

var MainScene = cc.Layer.extend({
	
	/*
	onTouchesMoved:function (touches, event) {
        //this.pressedButton();
        cc.AudioEngine.getInstance().stopMusic();
    },
    
    onTouchBegan:function (touches, event) {
        //this.pressedButton();
        cc.AudioEngine.getInstance().stopMusic();
    },
    
    onMouseDragged:function( event ) {
        //this.pressedButton();
        cc.AudioEngine.getInstance().stopMusic();
    },
    
    onKeyDown:function (e) {
        cc.AudioEngine.getInstance().stopMusic();
    },
    */
    
    pressedButton:function ()
    {
    	this.rootNode.animationManager.runAnimationsForSequenceNamed("UI End Timeline");
    },
});


MainScene.prototype.onDidLoadFromCCB = function () {

    // Start playing looped background music
    cc.AudioEngine.getInstance().setEffectsVolume(0.2);
    cc.AudioEngine.getInstance().playMusic("sounds/CAT_OP_BG.mp3",true);

}

// Create callback for button
MainScene.prototype.onPressButton = function()
{	
    // Rotate the label when the button is pressed
    //this.helloLabel.runAction(cc.RotateBy.create(1,360));
    this.rootNode.animationManager.runAnimationsForSequenceNamed("UI End Timeline");
};


MainScene.onTouchBegan = function (touch, event)
{
	this.rootNode.animationManager.runAnimationsForSequenceNamed("UI End Timeline");
    //this.prototype.onPressButton();
};

MainScene.onTouchEnded = function (touch, event)
{
	this.rootNode.animationManager.runAnimationsForSequenceNamed("UI End Timeline");
	//this.prototype.onPressButton();
};

MainScene.onMouseDragged = function ( event )
{
	this.rootNode.animationManager.runAnimationsForSequenceNamed("UI End Timeline");
	//this.prototype.onPressButton();
};

MainScene.onKeyDown = function ( event )
{
    cc.AudioEngine.getInstance().stopMusic();
};




