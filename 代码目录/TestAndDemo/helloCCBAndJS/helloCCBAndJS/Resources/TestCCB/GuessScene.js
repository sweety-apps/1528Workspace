// static Var
var kReturnButtonPushed = 1;

var gPushedButton = 0;

var gCurrentCCBView = null;

var gInputCharButtons = new Array();
var gInputCharButtonLabels = new Array();

var gResultCharButtons = new Array();
var gResultCharButtonLabels = new Array();

//
// GuessScene class
//

var GuessScene = function() {};

GuessScene.prototype.onDidLoadFromCCB = function () {
    
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

    // Start playing looped background music
    cc.AudioEngine.getInstance().playMusic("sounds/CAT_ROCK_VER.mp3",true);
    cc.AudioEngine.getInstance().setMusicVolume(0.5);

    // 初始化按钮变量
    this.InitVars();

    // 设置动画完成时的回调
    this.rootNode.animationManager.setCompletedAnimationCallback(this, this.onAnimationComplete);

    // 设置各种按钮的回调
    gCurrentCCBView = this;

    // returnButton Event
    setupPressEventToSprite(this.rootLayer,this.returnButton,this.returnButton);
    this.returnButton.onPressButton = function (){
        cc.AudioEngine.getInstance().stopMusic();
        cc.AudioEngine.getInstance().playEffect("sounds/MIAO1.mp3");
        gCurrentCCBView.rootNode.animationManager.runAnimationsForSequenceNamed("UI End Timeline");
        gPushedButton = kReturnButtonPushed;
    }

    // aboutButton Event
    /*
    setupPressEventToSprite(this.rootLayer,this.aboutButton,this.aboutButton);
    this.aboutButton.onPressButton = function (){
        window.open("http://223.4.33.112/about.html");
    }
    //
      */
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
                //GuessScene.rootNode.animationManager.runAnimationsForSequenceNamed("UI End Timeline");
                //GuessScene.onPressButton();
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
GuessScene.prototype.onAnimationComplete = function()
{
    if (gPushedButton == kReturnButtonPushed)
    {
        gPushedButton = 0;
        cc.AudioEngine.getInstance().stopMusic();
        gShouldKeepCoin = true;
        clearAllPressEventToSprite ();
        var scene = cc.BuilderReader.loadAsScene("MainScene");
        cc.Director.getInstance().replaceScene(scene);
        //gAudioEngine.stopMusic();
    }
};

GuessScene.prototype.InitVars = function()
{
    // Inputs
    gInputCharButtons[0] = this.charButton0;
    gInputCharButtonLabels[0] = this.charLbl0;

    gInputCharButtons[1] = this.charButton1;
    gInputCharButtonLabels[1] = this.charLbl1;

    gInputCharButtons[2] = this.charButton2;
    gInputCharButtonLabels[2] = this.charLbl2;

    gInputCharButtons[3] = this.charButton3;
    gInputCharButtonLabels[3] = this.charLbl3;

    gInputCharButtons[4] = this.charButton4;
    gInputCharButtonLabels[4] = this.charLbl4;

    gInputCharButtons[5] = this.charButton5;
    gInputCharButtonLabels[5] = this.charLbl5;

    gInputCharButtons[6] = this.charButton6;
    gInputCharButtonLabels[6] = this.charLbl6;

    gInputCharButtons[7] = this.charButton7;
    gInputCharButtonLabels[7] = this.charLbl7;

    gInputCharButtons[8] = this.charButton8;
    gInputCharButtonLabels[8] = this.charLbl8;

    gInputCharButtons[9] = this.charButton9;
    gInputCharButtonLabels[9] = this.charLbl9;

    gInputCharButtons[10] = this.charButton10;
    gInputCharButtonLabels[10] = this.charLbl10;

    gInputCharButtons[11] = this.charButton11;
    gInputCharButtonLabels[11] = this.charLbl11;

    gInputCharButtons[12] = this.charButton12;
    gInputCharButtonLabels[12] = this.charLbl12;

    gInputCharButtons[13] = this.charButton13;
    gInputCharButtonLabels[13] = this.charLbl13;

    gInputCharButtons[14] = this.charButton14;
    gInputCharButtonLabels[14] = this.charLbl14;

    gInputCharButtons[15] = this.charButton15;
    gInputCharButtonLabels[15] = this.charLbl15;

    gInputCharButtons[16] = this.charButton16;
    gInputCharButtonLabels[16] = this.charLbl16;

    gInputCharButtons[17] = this.charButton17;
    gInputCharButtonLabels[17] = this.charLbl17;

    gInputCharButtons[18] = this.charButton18;
    gInputCharButtonLabels[18] = this.charLbl18;

    gInputCharButtons[19] = this.charButton19;
    gInputCharButtonLabels[19] = this.charLbl19;

    gInputCharButtons[20] = this.charButton20;
    gInputCharButtonLabels[20] = this.charLbl20;

    gInputCharButtons[21] = this.charButton21;
    gInputCharButtonLabels[21] = this.charLbl21;

    gInputCharButtons[22] = this.charButton22;
    gInputCharButtonLabels[22] = this.charLbl22;

    gInputCharButtons[23] = this.charButton23;
    gInputCharButtonLabels[23] = this.charLbl23;

    // Results
    gResultCharButtons[0] = this.charButtonResult0;
    gResultCharButtonLabels[0] = this.charLblResult0;

    gResultCharButtons[1] = this.charButtonResult1;
    gResultCharButtonLabels[1] = this.charLblResult1;

    gResultCharButtons[2] = this.charButtonResult2;
    gResultCharButtonLabels[2] = this.charLblResult2;

    gResultCharButtonLabels[0].setString("大");
};

///// Events Handlers
// Touches
GuessScene.prototype.onTouchesBegan = function (touches, event)
{
    //TODO:
};

GuessScene.prototype.onTouchesMoved = function (touches, event)
{
    //TODO:
};

GuessScene.prototype.onTouchesEnded = function (touches, event)
{
    //this.controller.onPressButton();
    //this.prototype.onPressButton();
};

GuessScene.prototype.onTouchesCancelled = function (touches, event)
{
    //TODO:
};
// Mouse
GuessScene.prototype.onMouseDown = function ( event )
{
    //TODO:
};

GuessScene.prototype.onMouseDragged = function ( event )
{
    //TODO:
};

GuessScene.prototype.onMouseMoved = function ( event )
{
    //TODO:
};

GuessScene.prototype.onMouseUp = function ( event )
{
    //this.onPressButton();
    //this.prototype.onPressButton();
    //this.rootNode.animationManager.runAnimationsForSequenceNamed("UI End Timeline");
};

// Accelerometer
GuessScene.prototype.onAccelerometer = function( event)
{
    //TODO:
};