//
// MainScene class
//
require("jsb_cocos2d_constants.js");
require("jsb_cocos2d.js");
require("jsb_cocosbuilder.js");
require("jsb_sys.js");

var MainScene = function(){};

// Create callback for button
MainScene.prototype.onPressButton = function()
{	
    // Rotate the label when the button is pressed
    this.rootNode.animationManager.runAnimationsForSequenceNamed("UI End Timeline");
};