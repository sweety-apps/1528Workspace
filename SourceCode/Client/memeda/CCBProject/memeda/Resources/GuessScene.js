// const Var
// states
var kGuessStateNormal = 0;
var kGuessStatePullingChar = 2;
var kGuessStatePuttingResult = 3;

// static Var
var kReturnButtonPushed = 1;

var gPushedButton = 0;

var pressSprites = new Array();
var pressSpritesCallbacks = new Array();

var gCurrentCCBView = null;

var gInputCharButtons = new Array();

var gResultCharAllButtons = new Array();
var gResultCharButtons = new Array();

var gAwardButton = null;
var gProblem = 0;

var choosedButtons = new Array();
var choosedCharStrings = new Array();
var choosedButtonCount = 0;
var emptyButton = 0;

//var gBoardBG = null;
//var gBoardLabel = null;
//var gBoardPicture = null;
//var gBoardCover = null;

var gCatHand = null;

var gMusicURL = null;

var gCurrentChoosedCharButton = null;
var gCurrentPushedResultButton = null;

var gCurrentGuessState = kGuessStateNormal;
var gFlippingIndex = 1;

var gTimeCount = 0;
var gBuyNum = 0;		// 但前购买过的提示
var gAllBtnEnable = true;

function GuessScene_InitGlobel() {
	gAllBtnEnable = true;
	
    kGuessStateNormal = 0;
    kGuessStatePullingChar = 2;
    kGuessStatePuttingResult = 3;
    
    // static Var
    kReturnButtonPushed = 1;
    
    gBuyNum = 0;
    gPushedButton = 0;
    
    gCurrentCCBView = null;

    gInputCharButtons = new Array();
   
    gResultCharAllButtons = new Array();
    
    gResultCharButtons = new Array();
    
    gAwardButton = null;
    gProblem = 0;
    
    gCatHand = null;
    gMusicURL = null;
    gCurrentChoosedCharButton = null;
    gCurrentPushedResultButton = null;
    gCurrentGuessState = kGuessStateNormal;
    gFlippingIndex = 1;
    
    choosedButtons = new Array();
    choosedCharStrings = new Array();
    choosedButtonCount = 0;
    emptyButton = 0;
    
    gTimeCount = 0;
    
    pressSprites = new Array();
    pressSpritesCallbacks = new Array();
}
//
// GuessScene class
//

var GuessScene = function() {};
GuessScene.prototype.onDidUnload = function () {
    debugMsgOutput("fsdf");
}

GuessScene.prototype.onDidLoadFromCCB = function () {
    GuessScene_InitGlobel();
    
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
    
	// 初始化背景,给背景和文字框选择合适的背景
    gFlippingIndex = 3;
    this.bgLayer.controller.setBkg(2, 3);
    for (var i = 0; i < gResultCharAllButtons.length; i ++) {
        gResultCharAllButtons[i].controller.setImage(gFlippingIndex);
    }
};

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
GuessScene.prototype.onClickCoin = function () {
    gCurrentCCBView.ClickBuy();
}

GuessScene.prototype.onBack = function ( ) {
	if(cc.AudioEngine.getInstance().isMusicPlaying()) {
		cc.AudioEngine.getInstance().stopMusic();
	}
	
	cc.AudioEngine.getInstance().playEffect("sounds/MIAO1.mp3");
	var scene = cc.BuilderReader.loadAsScene("ChooseTestsScene.ccbi");
	cc.Director.getInstance().replaceScene(scene);
}

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
        gResultCharAllButtons[1] = this.charButtonResult1;
        gResultCharAllButtons[2] = this.charButtonResult2;
        gResultCharAllButtons[3] = this.charButtonResult3;
        gResultCharAllButtons[4] = this.charButtonResult4;
        gResultCharAllButtons[5] = this.charButtonResult5;
    }

    // result
    while(gResultCharButtons.length > 0)
    {
        gResultCharButtons.pop();
    }

    for (var i = 0; i < gResultCharAllButtons.length; i ++)
    {
        gResultCharAllButtons[i].setVisible(false);
    }

    var nChars = rightAnswers[0].length;    // 答案的字符数
    debugMsgOutput("RightAnswers : " + rightAnswers[0]);
    for ( var i = 0; i < nChars && i < 6; i ++ )
    {
        gResultCharButtons[i] = gResultCharAllButtons[i];
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

        var pos = cc.p(btnPos + i * btnSp, gResultCharButtons[i].getPosition().y);
        gResultCharButtons[i].setPosition(pos);

		gResultCharButtons[i].controller.setText("");
    }
}

GuessScene.prototype.InitVars = function()
{
    // Test Board
    //gBoardBG = this.boardBG;
    //gBoardLabel = this.questionLbl;
    //gBoardPicture = this.contentPicture;
    //gBoardCover = this.boardCover;

    // Other Buttons
    gAwardButton = this.awardButton;

    // 猫爪
    gCatHand = this.catHand;
    
    // Inputs
    gInputCharButtons[0] = this.charButton0;
    gInputCharButtons[1] = this.charButton1;
    gInputCharButtons[2] = this.charButton2;
    gInputCharButtons[3] = this.charButton3;
    gInputCharButtons[4] = this.charButton4;
    gInputCharButtons[5] = this.charButton5;
    gInputCharButtons[6] = this.charButton6;
    gInputCharButtons[7] = this.charButton7;
    gInputCharButtons[8] = this.charButton8;
    gInputCharButtons[9] = this.charButton9;
    gInputCharButtons[10] = this.charButton10;
    gInputCharButtons[11] = this.charButton11;
    gInputCharButtons[12] = this.charButton12;
    gInputCharButtons[13] = this.charButton13;
    gInputCharButtons[14] = this.charButton14;
    gInputCharButtons[15] = this.charButton15;
    gInputCharButtons[16] = this.charButton16;
    gInputCharButtons[17] = this.charButton17;
    
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
            gInputCharButtons[i].setScaleX(0.84);
            gInputCharButtons[i].setScaleY(0.84);
        }
        
        this.answerLayout.setScaleX(0.88);
        this.answerLayout.setScaleY(0.88);
        
        this.buyMsg.setScaleX(0.84);
        this.buyMsg.setScaleY(0.84);
    }
};


GuessScene.prototype.ClearVars = function()
{
    while(gInputCharButtons.length > 0)
    {
        gInputCharButtons.pop();
    }

    while(gResultCharButtons.length > 0)
    {
        gResultCharButtons.pop();
    }

    gCurrentCCBView = null;
    gAwardButton = null;

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
	gBuyNum = 0;

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
        gInputCharButtons[i].controller.setText(inputKeys.substring(i,i+1));
        gInputCharButtons[i].controller.setStatus(false);	// 按钮不可点击
    }

    for(i = 0; i < gResultCharButtons.length; i++)
    {
        gResultCharButtons[i].controller.setText("");
        choosedButtons.push(emptyButton);
        choosedCharStrings.push("");
    }

    // 播放音乐
    gMusicURL = "problem/" + gCurrentTestObj.content.musicUrl + ".mp3";
    gCurrentCCBView.CatEnter();
    
    gCurrentCCBView.SetTitleNum(gProblem + 1);
    choosedButtonCount = 0;

    for(i = 0; i < gInputCharButtons.length; i++)
    {
        setupPressEventToSprite(guessScene.rootLayer,gInputCharButtons[i],gInputCharButtons[i]);
        gInputCharButtons[i].controller.SetIndexNumber(i);
        if(i < inputKeys.length)
        {
            gInputCharButtons[i].setVisible(true);
        }
        else
        {
            gInputCharButtons[i].setVisible(false);
        }

		gInputCharButtons[i].controller.AttachClickEvent(function (obj) {
     		if ( !gAllBtnEnable ) {
                debugMsgOutput("Input Disable");
                return;				
			}
			
            if(gCurrentGuessState != kGuessStateNormal)
            {
                debugMsgOutput("Input return");
                return;
            }
            
      
            var sourceIndex = obj.GetIndexNumber();
                
            debugMsgOutput("choosedButtonCount " + choosedButtonCount + "  gResultCharButtons.length  " + gResultCharButtons.length);
            
            debugMsgOutput("choosedButtons.length " + choosedButtons.length);      
            if(choosedButtonCount < gResultCharButtons.length && gInputCharButtons[sourceIndex].isVisible())
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
                
                gCurrentGuessState = kGuessStatePullingChar;
                gCurrentChoosedCharButton = gInputCharButtons[sourceIndex];

                choosedButtons[choosedIndex] = gInputCharButtons[sourceIndex];
                choosedCharStrings[choosedIndex] = gInputCharButtons[sourceIndex].controller.getText();
                choosedButtons[choosedIndex].sourceButtonIndex = sourceIndex;
                gCurrentPushedResultButton = gResultCharButtons[choosedIndex];
                choosedButtonCount++;

                if(false)
                {   // 播放音乐
                    cc.AudioEngine.getInstance().playEffect("sounds/MIAO1.mp3");
                    gInputCharButtons[sourceIndex].setVisible(false);
                }

                gCurrentCCBView.updateInputCharsAndResultCharsWithAnimation();
            }
        });
    }

    for(i = 0; i < gResultCharButtons.length; i++)
    {
    	gResultCharButtons[i].controller.SetIndexNumber(i);
    	gResultCharButtons[i].controller.AttachClickEvent(function (obj) {
     		if ( !gAllBtnEnable ) {
                return;				
			}
			
			if(gCurrentGuessState != kGuessStateNormal) {
                return;
            }

            debugMsgOutput("Result");

            var choosedIndex = obj.GetIndexNumber();

            if(choosedButtons[choosedIndex] != emptyButton) {
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
        });
    }
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

		gResultCharButtons[i].controller.setText(showString);
    }

    gCurrentGuessState = kGuessStateNormal;
    gCurrentChoosedCharButton = null;
    gCurrentPushedResultButton = null;

    if(choosedButtonCount >= gResultCharButtons.length)
    {
        if(this.checkAnswer(resultString,gCurrentTestObj.content.rightAnswers))
        {
            debugMsgOutput("答对了！");
            if(cc.AudioEngine.getInstance().isMusicPlaying()) {
				cc.AudioEngine.getInstance().stopMusic();
			}
            gProblem += 1;
            this.EnableAllBtn(false);
            this.answerRight.controller.ShowMsg(this.onClickNext);
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
        	gCurrentCCBView.updateInputCharsAndResultChars();
        }
        debugMsgOutput("gCurrentGuessState ... kGuessStatePuttingResult");
    }
};

GuessScene.prototype.updateInputCharsAndResultCharsWithAnimation = function ()
{
    var choosedCharButtonSize = gCurrentChoosedCharButton.getContentSize();
    var handPos = gCurrentChoosedCharButton.convertToWorldSpace(cc.p(choosedCharButtonSize.width/2,choosedCharButtonSize.height/2));
    gCatHand.setPosition(handPos);
    gCatHand.animationManager.runAnimationsForSequenceNamed("Push Timeline");
};

GuessScene.prototype.onStartCatDrawingAnimation = function ()
{
    debugMsgOutput("On Start Drawing Animation!");
};

GuessScene.prototype.update = function() {
    gTimeCount ++;
    if ( gTimeCount >= 10 ) {
        debugMsgOutput("music " + cc.AudioEngine.getInstance().isMusicPlaying() );
        if ( !cc.AudioEngine.getInstance().isMusicPlaying() ) {
            gCurrentCCBView.onMusicStop();
            cc.Director.getInstance().getScheduler().unscheduleUpdateForTarget(this);
        }
        gTimeCount = 0;
    }
}

GuessScene.prototype._isRunning = function () {
    return true;
}

GuessScene.prototype.PlayMusic = function () {
    cc.Director.getInstance().getScheduler().unscheduleUpdateForTarget(this);
    
    try {
    	if ( cc.AudioEngine.getInstance().isMusicPlaying() ) {
    		cc.AudioEngine.getInstance().stopMusic();
    	}
   	 	cc.AudioEngine.getInstance().playMusic(gMusicURL, false);
    	cc.AudioEngine.getInstance().setMusicVolume(0.9);
    } catch (e) {
    }
    
    cc.Director.getInstance().getScheduler().scheduleUpdateForTarget(this, 0, !this._isRunning);

}

GuessScene.prototype.onMusicStop = function () {
	this.catAni.controller.Listen(false);
	this.playMusic.setVisible(true);
}

GuessScene.prototype.CatEnter = function () {
	this.PlayMusic();
    this.playMusic.setVisible(false);
	this.catAni.controller.Enter(this.onEnterCompleted, this);
}

GuessScene.prototype.ListenMusic = function () {
	this.PlayMusic();
	this.catAni.controller.Listen(true);
	this.playMusic.setVisible(false);
}
    
    
GuessScene.prototype.onClickReplay = function () {
    this.ListenMusic();  	
}

GuessScene.prototype.onEnterCompleted = function(obj) {
	obj.rootNode.animationManager.runAnimationsForSequenceNamed("Drawing Animation Timeline");	
	for ( var i = 0; i < gInputCharButtons.length; i ++ ) {
		gInputCharButtons[i].controller.setStatus(true);	
	}
}

GuessScene.prototype.ClickBuy = function () {
	var price = new Array(10, 20, 30, 40, 50, 60);
	this.EnableAllBtn(false);
	this.buyMsg.controller.ShowMsg(price[gBuyNum], "第" + (gBuyNum + 1) + "个字", this.onBuyMsgEnd);	
}

GuessScene.prototype.onBuyMsgEnd = function (res) {
	gCurrentCCBView.EnableAllBtn(true);
	if ( res == 1 ) {
		gBuyNum ++;
		// 查找第一个错字的位置
		var answer = gCurrentTestObj.content.rightAnswers[0];
		var resultIndex = -1;
		var resultChar = "";
		var inputIndex = -1;
		
		for (var i = 0; i < gResultCharButtons.length; i ++ ) {
			if ( gResultCharButtons[i].controller.getText() != answer[i] ) {
				resultIndex = i;
				resultChar = answer[i];
				break;
			}
		}
		
		for ( var i = 0; i < gResultCharButtons.length; i ++ ) {
			if ( gInputCharButtons[i].isVisible() &&
					gResultCharButtons[i].getText() == resultChar ) {
				inputIndex = i;
				break;		
			}
		}
		
		debugMsgOutput("result " + resultIndex + "   " + resultChar + "   " + answer);

		if ( choosedButtons[resultIndex] != emptyButton ) {
			var sourceIndex = choosedButtons[resultIndex].sourceButtonIndex;
			choosedButtons[resultIndex] = emptyButton;			choosedCharStrings[resultIndex] = "";
            choosedButtonCount--;

			gCurrentChoosedCharButton = null;
			gCurrentPushedResultButton = null;

            gInputCharButtons[sourceIndex].setVisible(true);
		}
                      
        choosedButtons[resultIndex] = gInputCharButtons[inputIndex];
        
        choosedCharStrings[resultIndex] = gResultCharButtons[inputIndex].controller.getText();
        choosedButtons[resultIndex].sourceButtonIndex = inputIndex;
        gCurrentPushedResultButton = gResultCharButtons[resultIndex];
        choosedButtonCount++;
        
        gInputCharButtons[inputIndex].setVisible(false);
        

		gCurrentCCBView.updateInputCharsAndResultChars();
	}
}

GuessScene.prototype.onClickNext = function() {
	gCurrentCCBView.EnableAllBtn(true);
	gCurrentCCBView.answerRight.controller.Hide();
	gCurrentCCBView.setupInputCharsAndResultChars(gProblem);
}

GuessScene.prototype.EnableAllBtn = function (enable) {
	gAllBtnEnable = enable;
	this.coinBtn.setEnabled(enable);
	this.returnBtn.setEnabled(enable);
}; 