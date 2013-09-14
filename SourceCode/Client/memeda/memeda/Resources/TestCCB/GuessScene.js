// const Var
// states

var kGuessStateNormal = 0;
var kGuessStatePullingChar = 2;
var kGuessStatePuttingResult = 3;

// static Var
var kReturnButtonPushed = 1;

var gPushedButton = 0;

var gCurrentCCBView = null;

var gInputCharButtons = new Array();
var gInputCharButtonLabels = new Array();

var gResultCharAllButtons = new Array();
var gResultCharAllButtonLabels = new Array();

var gResultCharButtons = new Array();
var gResultCharButtonLabels = new Array();

var gAwardButton = null;
var gProblem = 0;
var gDrawerCat = null;
//var gBoardBG = null;
//var gBoardLabel = null;
//var gBoardPicture = null;
//var gBoardCover = null;
 
var gCatHand = null;

var gCurrentChoosedCharButton = null;
var gCurrentPushedResultButton = null;

var gCurrentGuessState = kGuessStateNormal;
var gFlippingIndex = 1;
//
// GuessScene class
//

var GuessScene = function() {};

GuessScene.prototype.onDidLoadFromCCB = function () {

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

    // 初始化按钮变量
    this.InitVars();

    // 设置动画完成时的回调
    this.rootNode.animationManager.setCompletedAnimationCallback(this, this.onAnimationComplete);

    // 设置各种按钮的回调
    gCurrentCCBView = this;
    
    setupPressEventToSprite(this.rootLayer,this.wechatButton, this.wechatButton);
    this.wechatButton.onPressButton = function () {
    }
    
    setupPressEventToSprite(this.rootLayer,this.awardButton, this.awardButton);
    this.awardButton.onPressButton = function () {
    }
    
    // returnButton Event
    setupPressEventToSprite(this.rootLayer,this.returnButton,this.returnButton);
    this.returnButton.onPressButton = function (){
        debugMsgOutput("returnButton Pushed!");
        if(cc.AudioEngine.getInstance().isMusicPlaying())
        {
            cc.AudioEngine.getInstance().stopMusic();
        }
        cc.AudioEngine.getInstance().playEffect("sounds/MIAO1.mp3");
        var scene = cc.BuilderReader.loadAsScene("ChooseTestsScene.ccbi");
        cc.Director.getInstance().replaceScene(scene);
        //gCurrentCCBView.rootNode.animationManager.runAnimationsForSequenceNamed("UI End Timeline");
        //gPushedButton = kReturnButtonPushed;
    }
    
    
    
    // aboutButton Event
    /*
    setupPressEventToSprite(this.rootLayer,this.aboutButton,this.aboutButton);
    this.aboutButton.onPressButton = function (){
        window.open("http://223.4.33.112/about.html");
    }
    //
      */
    
    // 初始化输入等UI
    this.setupInputCharsAndResultChars(gProblem);

    // 初始化操作的动画
    this.setupSubCCBFileAnimationCallBacks();

    // 启动时的动画
    debugMsgOutput("On Start Drawing Animation!");
    this.onStartCatDrawingAnimation();

    // State Change
    gCurrentGuessState = kGuessStateNormal;
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
		return ;
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


GuessScene.prototype.SetTitleNum = function (num) {
    if ( num >= 100 ) {
        this.titleNum0.setVisible(true);
        this.titleNum1.setVisible(true);
        this.titleNum2.setVisible(true);

        var num2 = Math.floor(num / 100);
        var num1 = Math.floor( (num % 100) / 10);
        var num0 = num % 10;

        var image = "UI/guess/" + num2 + ".png";
        var spriteFrame = cc.SpriteFrame.create(image, cc.rect(0,0,17,20));
        this.titleNum2.setDisplayFrame(spriteFrame);

        image = "UI/guess/" + num1 + ".png";
        spriteFrame = cc.SpriteFrame.create(image, cc.rect(0,0,17,20));
        this.titleNum1.setDisplayFrame(spriteFrame);

        image = "UI/guess/" + num0 + ".png";
        spriteFrame = cc.SpriteFrame.create(image, cc.rect(0,0,17,20));
        this.titleNum0.setDisplayFrame(spriteFrame);
    } else if ( num >= 10 ) {
        this.titleNum0.setVisible(true);
        this.titleNum1.setVisible(true);
        this.titleNum2.setVisible(false);

        var num1 = Math.floor( num / 10);
        var num0 = num % 10;

        var image = "UI/guess/" + num1 + ".png";
        var spriteFrame = cc.SpriteFrame.create(image, cc.rect(0,0,17,20));
        this.titleNum1.setDisplayFrame(spriteFrame);

        image = "UI/guess/" + num0 + ".png";
        spriteFrame = cc.SpriteFrame.create(image, cc.rect(0,0,17,20));
        this.titleNum0.setDisplayFrame(spriteFrame);
    } else {
        this.titleNum0.setVisible(false);
        this.titleNum1.setVisible(true);
        this.titleNum2.setVisible(false);

        var image = "UI/guess/" + num + ".png";
        var spriteFrame = cc.SpriteFrame.create(image, cc.rect(0,0,17,20));
        this.titleNum1.setDisplayFrame(spriteFrame);
    }
}

///// This Scene Animation Callback Handlers
GuessScene.prototype.onAnimationComplete = function()
{
    if (gPushedButton == kReturnButtonPushed)
    {
        gPushedButton = 0;
        cc.AudioEngine.getInstance().stopMusic();
        gShouldKeepCoin = true;
        clearAllPressEventToSprite ();
        gCurrentCCBView.clearInputCharsAndResultChars();
        gCurrentCCBView.ClearVars();
        var scene = cc.BuilderReader.loadAsScene("MainScene.ccbi");
        cc.Director.getInstance().replaceScene(scene);
      
        //gAudioEngine.stopMusic();
    }

    debugMsgOutput(gCurrentCCBView.rootNode.animationManager.getLastCompletedSequenceName());

    if(gCurrentCCBView.rootNode.animationManager.getLastCompletedSequenceName() == "Drawing Animation Timeline")
    {
        gAwardButton.animationManager.runAnimationsForSequenceNamed("Flipping Timeline");
        //gInfoTipsCoverLabel.animationManager.runAnimationsForSequenceNamed("Shining Timeline");
    }

    if(gCurrentCCBView.rootNode.animationManager.getLastCompletedSequenceName() == "Win Timeline")
    {
        gCurrentCCBView.onStartCatDrawingAnimation();
    }
};

GuessScene.prototype.InitInputAndResultChar = function(rightAnswers, inputkeys)
{
    if ( gResultCharAllButtons.length == 0 )
    {
        gResultCharAllButtons[0] = this.charButtonResult0;
        gResultCharAllButtonLabels[0] = this.charLblResult0;

        gResultCharAllButtons[1] = this.charButtonResult1;
        gResultCharAllButtonLabels[1] = this.charLblResult1;

        gResultCharAllButtons[2] = this.charButtonResult2;
        gResultCharAllButtonLabels[2] = this.charLblResult2;

        gResultCharAllButtons[3] = this.charButtonResult3;
        gResultCharAllButtonLabels[3] = this.charLblResult3;

        gResultCharAllButtons[4] = this.charButtonResult4;
        gResultCharAllButtonLabels[4] = this.charLblResult4;

        gResultCharAllButtons[5] = this.charButtonResult5;
        gResultCharAllButtonLabels[5] = this.charLblResult5;
    }

    // result
    while(gResultCharButtons.length > 0)
    {
        gResultCharButtons.pop();
    }
    while(gResultCharButtonLabels.length > 0)
    {
        gResultCharButtonLabels.pop();
    }

    for (var i = 0; i < gResultCharAllButtons.length; i ++)
    {
        gResultCharAllButtons[i].setVisible(false);
        gResultCharAllButtonLabels[i].setVisible(false);
    }

    var nChars = rightAnswers[0].length;    // 答案的字符数
    debugMsgOutput("RightAnswers : " + rightAnswers[0]);
    for ( var i = 0; i < nChars && i < 6; i ++ )
    {
        gResultCharButtons[i] = gResultCharAllButtons[i];
        gResultCharButtonLabels[i] = gResultCharAllButtonLabels[i];
    }

    this.ResetResultButtonsPosition();
}

GuessScene.prototype.ResetResultButtonsPosition = function()
{
    var btnPosArray = new Array(94, 63.5, 38, 14, -3.5, -27.0);
    var btnSpArray = new Array(0, 64, 58, 54, 49, 49);

    var labelPosArray = new Array(94, 63.5, 38, 14, -3.5, -27.0);
    var labelSpArray = new Array(0, 64, 58, 54, 49, 49);

    var btnPos = btnPosArray[gResultCharButtons.length - 1];
    var btnSp = btnSpArray[gResultCharButtons.length - 1];

    var labelPos = labelPosArray[gResultCharButtons.length - 1];
    var labelSp = labelSpArray[gResultCharButtons.length - 1];

    for (var i = 0; i < gResultCharButtons.length; i ++)
    {
        gResultCharButtons[i].setVisible(true);
        gResultCharButtonLabels[i].setVisible(true);

        var pos = cc.p(btnPos + i * btnSp, gResultCharButtons[i].getPosition().y);
        gResultCharButtons[i].setPosition(pos);

        pos = cc.p(labelPos + i * labelSp, gResultCharButtonLabels[i].getPosition().y);
        gResultCharButtonLabels[i].setPosition(pos);
        gResultCharButtonLabels[i].setString("");
    }
}

GuessScene.prototype.InitVars = function()
{    
    // Drawer Cat
    gDrawerCat = this.drawerCat;

    // Test Board
    //gBoardBG = this.boardBG;
    //gBoardLabel = this.questionLbl;
    //gBoardPicture = this.contentPicture;
    //gBoardCover = this.boardCover;

    // Other Buttons
    gAwardButton = this.awardButton;

    // 猫爪
    gCatHand = this.catHand;

	// 初始化背景,给背景和文字框选择合适的背景
    gFlippingIndex = 1;
    this.bgLayer.controller.setBkg(2, 3);
    for (var i = 0; i < gResultCharButtons.length; i ++) {
        gResultCharButtons[i].controller.setImage(gFlippingIndex);
    }
    
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

    this.coinNum.setString("" + CoinMgr_GetCount());
    CoinMgr_Register(function (coin, add) {
        gCurrentCCBView.coinNum.setString("" + CoinMgr_GetCount());
    });

    // Do Scale
    var screenSize = cc.Director.getInstance().getWinSizeInPixels();

    debugMsgOutput("screen size ("+screenSize.width+","+screenSize.height+")");

    var screenWidth = screenSize.width > screenSize.height ? screenSize.height : screenSize.width;
    var screenHeight = screenSize.width > screenSize.height ? screenSize.width : screenSize.height;

    // 针对非iphone5屏幕做缩小适配
    if(screenHeight / screenWidth < 1136/640)
    {   
        for(var i = 0; i < gInputCharButtons.length; ++i)
        {
            gInputCharButtons[i].setScaleX(0.8);
            gInputCharButtons[i].setScaleY(0.8);
        }

        gDrawerCat.setScaleX(0.8);
        gDrawerCat.setScaleY(0.8);
        
        //gBoardBG.setScaleX(0.8);
        //gBoardBG.setScaleY(0.8);

        //gBoardLabel.setScaleX(0.8);
        //gBoardLabel.setScaleY(0.8);

        //gBoardPicture.setScaleX(0.8);
        //gBoardPicture.setScaleY(0.8);

        //gBoardCover.setScaleX(0.8);
        //gBoardCover.setScaleY(0.8);
    }
};


GuessScene.prototype.ClearVars = function()
{
    while(gInputCharButtons.length > 0)
    {
        gInputCharButtons.pop();
    }

    while(gInputCharButtonLabels.length > 0)
    {
        gInputCharButtonLabels.pop();
    }

    while(gResultCharButtons.length > 0)
    {
        gResultCharButtons.pop();
    }

    while(gResultCharButtonLabels.length > 0)
    {
        gResultCharButtonLabels.pop();
    }

    gCurrentCCBView = null;
    gAwardButton = null;

    gDrawerCat = null;
    //gBoardBG = null;
    //gBoardLabel = null;
    //gBoardPicture = null;
    //gBoardCover = null;

    gCatHand = null;
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
};

// Accelerometer
GuessScene.prototype.onAccelerometer = function( event)
{
    //TODO:
};


// test Game Logic
var gCurrentTestObj = {
    id:"00000",
    type:"text",
    level:"1",
    content:{
        inputkeys:"你打的没土小水话上下题白兔来草木宫说",
        inform:"打一种动物",
        rightanswer:"小白兔123",
        title:"小白＋小白＝？",
        imageurl:"",
        musicurl:""
    },
    knowladgetips:{
        id:"1",
        text:"小白兔是一种可以种植的中草药，对蛋疼有很好的疗效。"
    }
};

var choosedButtons = new Array();
var choosedCharStrings = new Array();
var choosedButtonCount = 0;
var emptyButton = 0;

GuessScene.prototype.checkAnswer = function (inputString, answerStrings)
{
    for (var i = 0; i < answerStrings.length; i ++) {
        if(inputString == answerStrings[i] ) {
            return true;
        }
    }
    return false;
};

function InsertCharToArray(arr, inputKey)
{
    var find = false;
    for (var i = 0; i < arr.length; i ++) {
        if ( arr[i] == inputKey ) {
            find = true;
            break;
        }
    }

    if ( !find ) {
        arr.push(inputKey);
    }
}


function MakeInputKeys(rightanswers, inputkeys) {
    var charArray = new Array();
    var ret = "";
    for (var i = 0; i < rightanswers.length; i ++) {
    	for (var j = 0; j < rightanswers[i].length; j ++) {
    		if ( i == 0 ) {
                charArray.push(rightanswers[i][j]);
    		} else {
    			InsertCharToArray(charArray, inputkeys[i]);
    		}
        }
    }
    
    for (var i = 0; i < inputkeys.length; i ++) {
        InsertCharToArray(charArray, inputkeys[i]);
        if ( charArray.length >= 18 ) {
            break;
        }
    }
    // 添加无关干扰词
    var other = new Array('三', '于', '干', '亏', '士', '工', '土',
                          '才','木','五','支','厅','不','太','寸','下','大','丈','与','万','上',
                          '小','口','巾','山','千','丰','王','井','开','夫','天','无','元','专',
                          '云','扎','内','水','见','午','牛','手','气','升');
    // 随机排序
    other.sort(function(a,b){
               if ( Math.random() > 0.5 ) {
               return 1;
               }
               return -1;
               });
    
    if ( charArray.length < 18 )
        for (var i = 0; i < other.length; i ++) {
            InsertCharToArray(charArray, other[i]);
            if ( charArray.length >= 18 ) {
                break;
            }
        }
    
    // 随机排序
    charArray.sort(function(a,b){
                   if ( Math.random() > 0.5 ) {
                   return 1;
                   }
                   return -1;
                   });
    
    for (var i = 0; i < charArray.length; i ++) {
        ret = ret + charArray[i];
    }
    
    return ret;
}

GuessScene.prototype.onReceivedTestData = function(testObj, guessScene)
{
    debugMsgOutput("onReceivedTestData");
    gCurrentTestObj = testObj;

    debugMsgOutput(gCurrentTestObj.content.inputkeys);

    var i = 0;
    var inputKeys = testObj.content.inputkeys;
    gCurrentCCBView.clearInputCharsAndResultChars();

    // 构造一个包含inputKeys和rightanswer中字符的字符串，长度为18
    inputKeys = MakeInputKeys(gCurrentTestObj.content.rightAnswers, inputKeys);
	gCurrentCCBView.InitInputAndResultChar(gCurrentTestObj.content.rightAnswers, gCurrentTestObj.content.inputkeys);
    
    for(i = 0; i < gInputCharButtons.length; i++)
    {
        gInputCharButtonLabels[i].setString(inputKeys.substring(i,i+1));
        gInputCharButtonLabels[i].setVisible(true);
    }
    debugMsgOutput("gResultCharButtonLabels.length " + gResultCharButtonLabels.length);
    for(i = 0; i < gResultCharButtonLabels.length; i++)
    {
        gResultCharButtonLabels[i].setString("");
        choosedButtons.push(emptyButton);
        choosedCharStrings.push("");
    }

    // 播放音乐
    cc.AudioEngine.getInstance().playMusic("problem/" + gCurrentTestObj.content.musicUrl + ".mp3",true);
    cc.AudioEngine.getInstance().setMusicVolume(0.9);
    gCurrentCCBView.SetTitleNum(gProblem + 1);
    choosedButtonCount = 0;

    for(i = 0; i < gInputCharButtons.length; i++)
    {
        setupPressEventToSprite(guessScene.rootLayer,gInputCharButtons[i],gInputCharButtons[i]);
        gInputCharButtons[i].buttonIndexNumber = i;
        if(i < inputKeys.length)
        {
            gInputCharButtons[i].setVisible(true);
        }
        else
        {
            gInputCharButtons[i].setVisible(false);
        }

        gInputCharButtons[i].onPressButton = function () {

            debugMsgOutput("Input");

            if(gCurrentGuessState != kGuessStateNormal)
            {
                debugMsgOutput("Input return");
                return;
            }
            debugMsgOutput("choosedButtonCount " + choosedButtonCount + "  gResultCharButtons.length  " + gResultCharButtons.length);
            
            debugMsgOutput("choosedButtons.length " + choosedButtons.length);      
            if(choosedButtonCount < gResultCharButtons.length && this.isVisible())
            {
                var choosedIndex = -1;

                var j = 0;
                for(j = 0; j < choosedButtons.length; j++)
                {
                    if(choosedButtons[j] == emptyButton)
                    {
                        choosedIndex = j;
                        break;
                    }
                }
                debugMsgOutput("emptyButton " + emptyButton);               
                debugMsgOutput("choosedIndex " + choosedIndex);

                var sourceIndex = this.buttonIndexNumber;

                gCurrentGuessState = kGuessStatePullingChar;
                gCurrentChoosedCharButton = this;

                choosedButtons[choosedIndex] = this;
                choosedCharStrings[choosedIndex] = gInputCharButtonLabels[sourceIndex].getString();
                choosedButtons[choosedIndex].sourceButtonIndex = sourceIndex;
                gCurrentPushedResultButton = gResultCharButtons[choosedIndex];
                choosedButtonCount++;

                if(false)
                {   // 播放音乐
                    cc.AudioEngine.getInstance().playEffect("sounds/MIAO1.mp3");
                    this.setVisible(false);
                }

                gCurrentCCBView.updateInputCharsAndResultCharsWithAnimation();
            }
        }
    }

    for(i = 0; i < gResultCharButtons.length; i++)
    {
        setupPressEventToSprite(guessScene.rootLayer,gResultCharButtons[i],gResultCharButtons[i]);
        gResultCharButtons[i].buttonIndexNumber = i;
        gResultCharButtons[i].onPressButton = function () {

            if(gCurrentGuessState != kGuessStateNormal)
            {
                return;
            }

            debugMsgOutput("Result");

            var choosedIndex = this.buttonIndexNumber;

            if(choosedButtons[choosedIndex] != emptyButton)
            {
                var sourceIndex = choosedButtons[choosedIndex].sourceButtonIndex;

                choosedButtons[choosedIndex] = emptyButton;
                choosedCharStrings[choosedIndex] = "";
                choosedButtonCount--;

                gCurrentChoosedCharButton = null;
                gCurrentPushedResultButton = null;

                cc.AudioEngine.getInstance().playEffect("sounds/MIAO1.mp3");
                gInputCharButtons[sourceIndex].setVisible(true);

                gCurrentCCBView.updateInputCharsAndResultChars();

            }
        }
    }

    //guessScene.questionLbl.setString(testObj.content.title);
};

GuessScene.prototype.setupInputCharsAndResultChars = function (index)
{
    debugMsgOutput("setupInputCharsAndResultChars");
    Problem_RequestInfo(index, this.onReceivedTestData,null,this);
};

GuessScene.prototype.updateInputCharsAndResultChars = function ()
{
    var i = 0;
    var resultString = "";
    for(i = 0; i < gResultCharButtons.length; i++)
    {
        var showString = "";
        if(choosedButtons[i] != emptyButton)
        {
            showString = choosedCharStrings[i];
            resultString = resultString + showString;
        }

        gResultCharButtonLabels[i].setString(showString);
    }

    gCurrentGuessState = kGuessStateNormal;
    gCurrentChoosedCharButton = null;
    gCurrentPushedResultButton = null;

    if(choosedButtonCount >= gResultCharButtons.length)
    {
        if(this.checkAnswer(resultString,gCurrentTestObj.content.rightAnswers))
        {
            debugMsgOutput("答对了！");
            
            gProblem += 1;
            this.setupInputCharsAndResultChars(gProblem);
            gCurrentCCBView.rootNode.animationManager.runAnimationsForSequenceNamed("Win Timeline");
        }
        else
        {
            debugMsgOutput("可惜答错了，再接再厉！");
        }
    }
};

GuessScene.prototype.clearInputCharsAndResultChars = function ()
{
    while(choosedButtons.length > 0)
    {
        choosedButtons.pop();
    }

    while(choosedCharStrings.length > 0)
    {
        choosedCharStrings.pop();
    }
};

//动画回调
GuessScene.prototype.setupSubCCBFileAnimationCallBacks = function()
{
    for(var i = 0; i < gResultCharButtons.length; ++i)
    {
        // 设置动画完成时的回调
        gResultCharButtons[i].animationManager.setCompletedAnimationCallback(this, this.onSubCCBFileAnimationComplete);
    }

    gCatHand.animationManager.setCompletedAnimationCallback(this, this.onSubCCBFileAnimationComplete);
}

GuessScene.prototype.onSubCCBFileAnimationComplete = function()
{
    if(gCatHand != null && gCatHand != undefined && gCurrentPushedResultButton != null && gCurrentPushedResultButton!= undefined)
    {
        debugMsgOutput("[Hand Finished:] " + gCatHand.animationManager.getLastCompletedSequenceName()
            + "\n[Result Char Finshed:] " +  gCurrentPushedResultButton.animationManager.getLastCompletedSequenceName()
            + "\n[Current States:] " + parseInt(gCurrentGuessState)
        );
    }

    if(gCatHand.animationManager.getLastCompletedSequenceName() == "Push Timeline")
    {
        if(gCurrentGuessState == kGuessStatePullingChar)
        {
            if(gCurrentChoosedCharButton != null && gCurrentChoosedCharButton != undefined)
            {
                gCurrentChoosedCharButton.setVisible(false);
            }
            else
            {
                debugMsgOutput("[Error] gCurrentChoosedCharButton = null!");
            }
            gCurrentChoosedCharButton = null;
        }
    }

    if(/*gCatHand.animationManager.getLastCompletedSequenceName() == "Pull Timeline" ||*/ gCatHand.animationManager.getLastCompletedSequenceName() == "Hidden Timeline")
    {
        if(gCurrentGuessState == kGuessStatePullingChar)
        {
            debugMsgOutput("gCurrentGuessState == kGuessStatePullingChar");
            var choosedResultButtonSize = gCurrentPushedResultButton.getContentSize();
            var handPos = gCurrentPushedResultButton.convertToWorldSpace(cc.p(choosedResultButtonSize.width/2,choosedResultButtonSize.height/2));
            gCatHand.setPosition(handPos);
            gCatHand.animationManager.runAnimationsForSequenceNamed("Push Timeline");
            gCurrentGuessState = kGuessStatePuttingResult;
        }
        else if(gCurrentGuessState == kGuessStatePuttingResult)
        {
            debugMsgOutput("gCurrentGuessState == kGuessStatePuttingResult");
            gCurrentPushedResultButton.animationManager.runAnimationsForSequenceNamed("Flipping" + gFlippingIndex + " Timeline");
        }
        debugMsgOutput("gCurrentGuessState ... kGuessStatePuttingResult");
    }

    if(gCurrentPushedResultButton != null &&
        gCurrentPushedResultButton.animationManager.getLastCompletedSequenceName() == "Flipping" + gFlippingIndex + " Timeline")
    {
        gCurrentCCBView.updateInputCharsAndResultChars();

        CoinMgr_Change(30);
    }
};

GuessScene.prototype.updateInputCharsAndResultCharsWithAnimation = function ()
{
    var choosedCharButtonSize = gCurrentChoosedCharButton.getContentSize();
    var handPos = gCurrentChoosedCharButton.convertToWorldSpace(cc.p(choosedCharButtonSize.width/2,choosedCharButtonSize.height/2));
    gCatHand.setPosition(handPos);
    gCatHand.animationManager.runAnimationsForSequenceNamed("Push Timeline");

    /*
    var i = 0;
    var resultString = "";
    for(i = 0; i < gResultCharButtons.length; i++)
    {
        var showString = "";
        if(choosedButtons[i] != emptyButton)
        {
            showString = choosedCharStrings[i];
            resultString = resultString + showString;
        }

        gResultCharButtonLabels[i].setString(showString);
    }

    gIsPickingCharNow = false;

    if(choosedButtonCount >= gResultCharButtons.length)
    {
        if(this.checkAnswer(resultString,gCurrentTestObj.content.rightanswer))
        {
            debugMsgOutput("答对了！");
            this.setupInputCharsAndResultChars();
        }
        else
        {
            debugMsgOutput("可惜答错了，再接再厉！");
        }
    }
    */
};

GuessScene.prototype.onStartCatDrawingAnimation = function ()
{
    debugMsgOutput("On Start Drawing Animation!");
    //gDrawerCat.animationManager.runAnimationsForSequenceNamed("Draw Animation Timeline");
};

