// static Var
var kPlayButtonPushed = 1;

var gPushedButton = 0;

var gCurrentCCBView = null;

var gShouldKeepCoin = false;

var gLogLabel = null;

//
// MainScene class
//

var MainScene = function() {};

MainScene.prototype.onDidLoadFromCCB = function () {

    // 设备上面需要开启触摸
    if( 'touches' in sys.capabilities )
        this.rootNode.setTouchEnabled(true);

	// Forward relevant touch events to controller (this)
	// Touches
    this.rootNode.onTouchesBegan = function( touches, event) {
        this.controller.onTouchesBegan(touches, event);
        return true;
    };
    this.rootNode.onTouchesMoved = function( touches, event) {
        this.controller.onTouchesMoved(touches, event);
        return true;
    };
    this.rootNode.onTouchesEnded = function( touches, event) {
        this.controller.onTouchesMoved(touches, event);
        return true;
    };
    this.rootNode.onTouchesCancelled = function( touches, event) {
        this.controller.onTouchesCancelled(touches, event);
        return true;
    };
    // Mouse
    this.rootNode.onMouseDown = function( event) {
        this.controller.onMouseDown(event);
        return true;
    };
    this.rootNode.onMouseDragged = function( event) {
        this.controller.onMouseDragged(event);
        return true;
    };
    this.rootNode.onMouseMoved = function( event) {
        this.controller.onMouseMoved(event);
        return true;
    };
    this.rootNode.onMouseUp = function( event) {
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
    if ( !Globel_isWeb() ) {
    	cc.AudioEngine.getInstance().playMusic("sounds/CAT_FIGHT_BG.mp3",true);
    	cc.AudioEngine.getInstance().setMusicVolume(0.5);
    }
    
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
    	window.open("http://"+kDataServerHost+"/about.html");
    }
    
    // testButton Event
    gLogLabel = this.logLabel;
    setupPressEventToSprite(this.rootLayer,this.testButton,this.testButton);
    this.testButton.onPressButton = function (){
        var succeedReaction = function (aTest,context)
        {
            gLogLabel.setString(aTest.content.title);
        }
        requestTestDataObject(succeedReaction);
    }
    //

};

var pressSprites = new Array();
var pressSpritesCallbacks = new Array();

function setupPressEventToSprite(layer, sprite, callback)
{
	var contentSize  =  sprite.getContentSize();
	//debugMsgOutput("ContentSize = ("+contentSize.width+","+contentSize.height+")");
	//如果需要缩小点击区域，请用以下参数
	var rescaleTouchRectFactorX = 0.5;
	var rescaleTouchRectFactorY = 0.5;
	
	//判断触摸点是否在图片的区域上
	sprite.containsTouchLocation = function (touch) {
        //debugMsgOutput("tttest");

        var realScaleFactorX = rescaleTouchRectFactorX * this.getScaleX();
        var realScaleFactorY = rescaleTouchRectFactorX * this.getScaleY();

        //获取触摸点位置
        var getPoint = touch.getLocation();
        //获取图片区域尺寸
        var contentSize  =  this.getContentSize();
        //定义拖拽的区域
        var spritePosition = this.convertToWorldSpace(cc.p(contentSize.width/2,contentSize.height/2));
        var myRect = cc.rect(spritePosition.x, spritePosition.y, contentSize.width, contentSize.height);
        //myRect.x += this.getPosition().x-this.getContentSize().width/2;
        //myRect.y += this.getPosition().y-this.getContentSize().height/2;
        myRect.x = myRect.x-this.getContentSize().width/2;
        myRect.y = myRect.y-this.getContentSize().height/2;
        
        //重新计算触摸区域
        //debugMsgOutput("myRect = ("+myRect.x+","+myRect.y+","+myRect.width+","+myRect.height+")");
        myRect.x = myRect.x + ((myRect.width * (1.0-realScaleFactorX)) * 0.5);
        myRect.y = myRect.y + ((myRect.height * (1.0-realScaleFactorY)) * 0.5);
        myRect.width = myRect.width * realScaleFactorX;
        myRect.height = myRect.height * realScaleFactorY;
        
        var ret = false;
        
        if(!cc.rectContainsPoint(myRect, getPoint))
        {
        	ret = false;
        }
        else
        {
        	ret = true;
        }
        
        //debugMsgOutput("myRect = ("+myRect.x+","+myRect.y+","+myRect.width+","+myRect.height+")");
        //debugMsgOutput("Point = ("+ getPoint.x + "," + getPoint.y + ")\nContentSize = ("+contentSize.width+","+contentSize.height+")\nRet = " + ret);
        
        //判断点击是否在区域上
        return ret;
    };
    
    pressSprites.push(sprite);
	pressSpritesCallbacks.push(callback);
    
	var callBackRet = function (touch){
		//debugMsgOutput("len"+pressSprites.length);
		var i;
		for(i = 0; i < pressSprites.length; i++)
		{
			if(pressSpritesCallbacks[i] != null && pressSprites[i].containsTouchLocation(touch))
    		{
    			//debugMsgOutput("callback");
    			//MainScene.rootNode.animationManager.runAnimationsForSequenceNamed("UI End Timeline");
    			//MainScene.onPressButton();
    			pressSpritesCallbacks[i].onPressButton();
        		return true;
    		}
		}
    	return false;
	}
	
	
	layer.onTouchesEnded = function( touches, event) {
    	return callBackRet(touches[0]);
    };
    /*
    layer.onMouseUp = function( event) {
    	return callBackRet();
    };
    */
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
		var scene = cc.BuilderReader.loadAsScene("GuessScene.ccbi");
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

