// static Var
var kPlayButtonPushed = 1;

var gPushedButton = 0;

var gCurrentCCBView = null;

var gShouldKeepCoin = false;


//
// MainScene class
//

var MainScene = function() {};

MainScene.prototype.onDidLoadFromCCB = function () {
    
    //if( 'mouse' in sys.capabilities )
    //    this.setMouseEnabled(true);
    
    if( 'touches' in sys.capabilities )
        this.rootNode.setTouchEnabled(true);

	// Forward relevant touch events to controller (this)
	// Touches
    this.rootNode.onTouchesBegan = function( touches, event) {
        //cc.log("BBB");
        this.controller.onTouchesBegan(touches, event);
        return true;
    };
    this.rootNode.onTouchesMoved = function( touches, event) {
        //cc.log("BBB");
        this.controller.onTouchesMoved(touches, event);
        return true;
    };
    this.rootNode.onTouchesEnded = function( touches, event) {
        //cc.log("BBB");
        this.controller.onTouchesMoved(touches, event);
        return true;
    };
    this.rootNode.onTouchesCancelled = function( touches, event) {
        //cc.log("BBB");
        this.controller.onTouchesCancelled(touches, event);
        return true;
    };
    // Mouse
    this.rootNode.onMouseDown = function( event) {
        //cc.log("BBB");
        this.controller.onMouseDown(event);
        return true;
    };
    this.rootNode.onMouseDragged = function( event) {
        //cc.log("BBB");
        this.controller.onMouseDragged(event);
        return true;
    };
    this.rootNode.onMouseMoved = function( event) {
        //cc.log("BBB");
        this.controller.onMouseMoved(event);
        return true;
    };
    this.rootNode.onMouseUp = function( event) {
        //cc.log("BBB");
        this.controller.onMouseUp(event);
        return true;
    };
    // Accelerometer
    this.rootNode.onAccelerometer = function( event) {
        this.controller.onAccelerometer(event);
    };
    /*
    // Logic Methods
    this.rootNode.controller.onPressButton = function()
	{	
    	// Rotate the label when the button is pressed
    	//this.helloLabel.runAction(cc.RotateBy.create(1,360));
    	//window.open("http://www.baidu.com");
    	//cc.AudioEngine.getInstance().stopMusic();
    	this.rootNode.animationManager.runAnimationsForSequenceNamed("UI End Timeline");
	};
	*/

    // Start playing looped background music
    cc.AudioEngine.getInstance().playMusic("sounds/CAT_FIGHT_BG.mp3",true);
    cc.AudioEngine.getInstance().setMusicVolume(0.5);
    
    cc.log("MIAO!");

    if(gShouldKeepCoin)
    {
        gShouldKeepCoin = false;
        this.rootNode.animationManager.runAnimationsForSequenceNamed("UI Begin Timeline Without Coin Animation");
    }
    
    // 设置动画完成时的回调
    this.rootNode.animationManager.setCompletedAnimationCallback(this, this.onAnimationComplete);
    
    // 设置各种按钮的回调
    gCurrentCCBView = this;
    
    // startButton Event
    setupPressEventToSprite(this.rootLayer,this.startButton,this.startButton);
    this.startButton.onPressButton = function (){
        cc.AudioEngine.getInstance().stopMusic();
        cc.AudioEngine.getInstance().playEffect("sounds/MIAO1.mp3");
        gCurrentCCBView.rootNode.animationManager.runAnimationsForSequenceNamed("UI End Timeline");
        gPushedButton = kPlayButtonPushed;
    }
    
    // aboutButton Event
    setupPressEventToSprite(this.rootLayer,this.aboutButton,this.aboutButton);
    this.aboutButton.onPressButton = function (){
    	window.open("http://223.4.33.112/about.html");
    }
    //

};

var pressSprites = new Array();
var pressSpritesCallbacks = new Array();

function setupPressEventToSprite(layer, sprite, callback)
{
	var contentSize  =  sprite.getContentSize();
	//alert("ContentSize = ("+contentSize.width+","+contentSize.height+")");
	//如果需要缩小点击区域，请用以下参数
	var rescaleTouchRectFactorX = 0.5;
	var rescaleTouchRectFactorY = 0.5;
	
	//判断触摸点是否在图片的区域上
	sprite.containsTouchLocation = function (touch) {
        //alert("tttest");
        //获取触摸点位置
        var getPoint = touch.getLocation();//sprite.convertToNodeSpace(touch.getLocation());//
        //获取图片区域尺寸
        var contentSize  =  this.getContentSize();
        //定义拖拽的区域
        var myRect = cc.rect(0, 0, contentSize.width, contentSize.height);
        myRect.x += this.getPosition().x-this.getContentSize().width/2;
        myRect.y += this.getPosition().y-this.getContentSize().height/2;
        
        //重新计算触摸区域
        //alert("myRect = ("+myRect.x+","+myRect.y+","+myRect.width+","+myRect.height+")");
        myRect.x = myRect.x + ((myRect.width * (1.0-rescaleTouchRectFactorX)) * 0.5);
        myRect.y = myRect.y + ((myRect.height * (1.0-rescaleTouchRectFactorY)) * 0.5);
        myRect.width = myRect.width * rescaleTouchRectFactorX;
        myRect.height = myRect.height * rescaleTouchRectFactorY;
        
        var ret = false;
        
        if(!cc.rectContainsPoint(myRect, getPoint))
        {
        	ret = false;
        }
        else
        {
        	ret = true;
        }
        
        //alert("myRect = ("+myRect.x+","+myRect.y+","+myRect.width+","+myRect.height+")");
        //alert("Point = ("+ getPoint.x + "," + getPoint.y + ")\nContentSize = ("+contentSize.width+","+contentSize.height+")\nRet = " + ret);
        
        //判断点击是否在区域上
        return ret;
    };
    
    pressSprites.push(sprite);
	pressSpritesCallbacks.push(callback);
    
	var callBackRet = function (touch){
		//alert("len"+pressSprites.length);
		var i;
		for(i = 0; i < pressSprites.length; i++)
		{
			if(pressSpritesCallbacks[i] != null && pressSprites[i].containsTouchLocation(touch))
    		{
    			//alert("callback");
    			//MainScene.rootNode.animationManager.runAnimationsForSequenceNamed("UI End Timeline");
    			//MainScene.onPressButton();
    			pressSpritesCallbacks[i].onPressButton();
        		return true;
    		}
		}
    	return false;
	}
	
    cc.log("AAA");
	
	layer.onTouchesEnded = function( touches, event) {
        cc.log("BBB");
    	return callBackRet(touches[0]);
    };
    
    layer.onMouseUp = function( event) {
        cc.log("BBB");
    	return false;
        //return callBackRet();
    };
}

function clearAllPressEventToSprite ()
{
    while(pressSprites.length > 0)
    {
        pressSprites.pop();
    }
    while(pressSpritesCallbacks.length > 0)
    {
        pressSpritesCallbacks.pop();
    }
}

///// Logic Methods

///// Animation Callback Handlers
MainScene.prototype.onAnimationComplete = function()
{
	if (gPushedButton == kPlayButtonPushed)
	{
        gPushedButton = 0;
        cc.AudioEngine.getInstance().stopMusic();
        clearAllPressEventToSprite ();
		var scene = cc.BuilderReader.loadAsScene("GuessScene");
		cc.Director.getInstance().replaceScene(scene);
    }
};

MainScene.prototype.onStartPlay = function()
{

};


///// Events Handlers
// Touches
MainScene.prototype.onTouchesBegan = function (touches, event)
{
	//TODO:
};

MainScene.prototype.onTouchesMoved = function (touches, event)
{
	//TODO:
};

MainScene.prototype.onTouchesEnded = function (touches, event)
{
	//this.controller.onPressButton();
	//this.prototype.onPressButton();
    cc.log("BBB");
};

MainScene.prototype.onTouchesCancelled = function (touches, event)
{
	//TODO:
};
// Mouse
MainScene.prototype.onMouseDown = function ( event )
{
	//TODO:
};

MainScene.prototype.onMouseDragged = function ( event )
{
	//TODO:
};

MainScene.prototype.onMouseMoved = function ( event )
{
	//TODO:
};

MainScene.prototype.onMouseUp = function ( event )
{
	//this.onPressButton();
	//this.prototype.onPressButton();
	//this.rootNode.animationManager.runAnimationsForSequenceNamed("UI End Timeline");
};

// Accelerometer
MainScene.prototype.onAccelerometer = function( event) 
{
    //TODO:
};

