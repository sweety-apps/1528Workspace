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
var gSource = 1;

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

var gFlippingIndex = 1;

var gTimeCount = 0;
var gBuyList = null; // 但前购买过的提示
var gAllBtnEnable = true;
var gPreload = false;
var gColor = null;

gColor = new Object();
gColor.bg = "floor_pink";
gColor.door = "door_pink";
		
function GuessScene_SetFloorInfo(index, source, color) {
    Problem_setCurrentIndex(index);
	gProblem = index;	//
	gSource = source;
	gColor = color;
	
	if ( color == null ) {
		gColor = new Object();
		gColor.bg = "floor_pink";
		gColor.door = "door_pink";
	}
		
	debugMsgOutput("GuessScene_SetFloorInfo " + gProblem);
}

function GuessScene_Preload(preload) {
    gPreload = preload;
}

function GuessScene_InitGlobel() {
	gAllBtnEnable = true;
	
    kGuessStateNormal = 0;
    kGuessStatePullingChar = 2;
    kGuessStatePuttingResult = 3;
    
    // static Var
    kReturnButtonPushed = 1;
    
    gBuyList = null;
    gPushedButton = 0;
    
    gCurrentCCBView = null;

    gInputCharButtons = new Array();
   
    gResultCharAllButtons = new Array();
    
    gResultCharButtons = new Array();
    
    gAwardButton = null;
    
    gCatHand = null;
    gMusicURL = null;

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

GuessScene.prototype.onEnterTransitionDidFinish = function () {
	debugMsgOutput("GuessScene.prototype.onEnterTransitionDidFinish");
};

GuessScene.prototype.onDidLoadFromCCB = function () {
	if ( gPreload ) {
		return ;
	}
	
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
    
    this.catAni.controller.attachEvent(this, this.onClickReplay, this.onClickCat);
    
    // 初始化输入等UI
    this.setupInputCharsAndResultChars(gProblem);

    // 初始化操作的动画
    this.setupSubCCBFileAnimationCallBacks();
    
    // 购买按钮
    this.coinCtrl.controller.registerBuyEvent(this, this.onClickedCoinButton);
    
    this.checkExtraCoin();
    debugMsgOutput("GuessScene.prototype.onDidLoadFromCCB");
};

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
	debugMsgOutput("GuessScene.prototype.onClickCoin ...");
    gCurrentCCBView.ClickBuy();
}

GuessScene.prototype.onBack = function ( ) {
    // 上报数据
    if ( !Global_isWeb() ) {
    	var param = memeda.Stat.createParam();
    	param.addKeyAndValue("index", ""+gProblem);
    	param.addKeyAndValue("aid", ""+gCurrentTestObj.id);
        param.addKeyAndValue("question", gProblemProject);
            
    	memeda.Stat.logEvent("guessback", param);
    }
    //
    
    try {
		if(cc.AudioEngine.getInstance().isMusicPlaying()) {
			cc.AudioEngine.getInstance().stopMusic();
            cc.AudioEngine.getInstance().setMusicVolume(0.0);
		}
    } catch (e) {
    }
	
	cc.AudioEngine.getInstance().playEffect("sounds/Click_Wood_Cancel.mp3");
	
    var scene = cc.BuilderReader.loadAsScene("ChooseTestsScene.ccbi");
    scene = cc.TransitionFadeTR.create(0.4,scene);
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

        var image = "UI/title/" + num2 + ".png";
        //var spriteFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame(image);
        //this.titleNum2.setDisplayFrame(spriteFrame);
        UtilsFunctions_setSpriteImageWithName(this.titleNum2,image);

        image = "UI/title/" + num1 + ".png";
        //spriteFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame(image);
        //this.titleNum1.setDisplayFrame(spriteFrame);
        UtilsFunctions_setSpriteImageWithName(this.titleNum1,image);

        image = "UI/title/" + num0 + ".png";
        //spriteFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame(image);
        //this.titleNum0.setDisplayFrame(spriteFrame);
        UtilsFunctions_setSpriteImageWithName(this.titleNum0,image);
    } else if ( num >= 10 ) {
        this.titleNum0.setVisible(true);
        this.titleNum1.setVisible(true);
        this.titleNum2.setVisible(false);

        var num1 = Math.floor( num / 10);
        var num0 = num % 10;

        var image = "UI/title/" + num1 + ".png";
        //spriteFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame(image);
        //this.titleNum1.setDisplayFrame(spriteFrame);
        UtilsFunctions_setSpriteImageWithName(this.titleNum1,image);

        image = "UI/title/" + num0 + ".png";
        //spriteFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame(image);
        //this.titleNum0.setDisplayFrame(spriteFrame);
        UtilsFunctions_setSpriteImageWithName(this.titleNum0,image);
    } else {
        this.titleNum0.setVisible(false);
        this.titleNum1.setVisible(true);
        this.titleNum2.setVisible(false);

        var image = "UI/title/" + num + ".png";
        //var spriteFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame(image);
        //this.titleNum1.setDisplayFrame(spriteFrame);
        UtilsFunctions_setSpriteImageWithName(this.titleNum1,image);
    }
}

///// This Scene Animation Callback Handlers
GuessScene.prototype.onAnimationComplete = function()
{
    if (gPushedButton == kReturnButtonPushed)
    {
        gPushedButton = 0;
        cc.AudioEngine.getInstance().stopMusic();
        cc.AudioEngine.getInstance().setMusicVolume(0.0);
        
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
    }
};

GuessScene.prototype.InitInputAndResultChar = function(rightAnswers, inputkeys)
{
    // result
    while(gResultCharButtons.length > 0)
    {
        gResultCharButtons.pop();
    }

    for (var i = 0; i < gResultCharAllButtons.length; i ++)
    {
        gResultCharAllButtons[i].controller.setNone();
    }

    var nChars = rightAnswers.length;    // 答案的字符数
    debugMsgOutput("RightAnswers : " + rightAnswers);
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
    
    // Inputs 顺序打乱
    gInputCharButtons[0] = this.charButton0;
    gInputCharButtons[1] = this.charButton11;
    gInputCharButtons[2] = this.charButton23;
    gInputCharButtons[3] = this.charButton13;
    gInputCharButtons[4] = this.charButton4;
    gInputCharButtons[5] = this.charButton20;
    gInputCharButtons[6] = this.charButton6;
    gInputCharButtons[7] = this.charButton17;
    gInputCharButtons[8] = this.charButton8;
    gInputCharButtons[9] = this.charButton15;
    gInputCharButtons[10] = this.charButton10;
    gInputCharButtons[11] = this.charButton22;
    gInputCharButtons[12] = this.charButton1;
    gInputCharButtons[13] = this.charButton9;
    gInputCharButtons[14] = this.charButton14;
    gInputCharButtons[15] = this.charButton19;
    gInputCharButtons[16] = this.charButton16;
    gInputCharButtons[17] = this.charButton7;
    gInputCharButtons[18] = this.charButton18;
    gInputCharButtons[19] = this.charButton3;
    gInputCharButtons[20] = this.charButton5;
    gInputCharButtons[21] = this.charButton21;
    gInputCharButtons[22] = this.charButton2;
    gInputCharButtons[23] = this.charButton12;
    
    // Do Scale
    var screenSize = cc.Director.getInstance().getWinSizeInPixels();

    debugMsgOutput("screen size ("+screenSize.width+","+screenSize.height+")");

    var screenWidth = screenSize.width > screenSize.height ? screenSize.height : screenSize.width;
    var screenHeight = screenSize.width > screenSize.height ? screenSize.width : screenSize.height;

    // 针对非iphone5屏幕做缩小适配
    if(screenHeight / screenWidth < 1136/640)
    {   
        this.answerLayout.setScaleX(0.88);
        this.answerLayout.setScaleY(0.88);
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
var gCurrentTestObj = null;

GuessScene.prototype.checkAnswer = function (inputString, answerStrings)
{
    if(inputString == answerStrings ) {
        return true;
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
        charArray.push(rightanswers[i]);
    }
    
    if ( inputkeys != undefined ) {
        for (var i = 0; i < inputkeys.length; i ++) {
        	if ( inputkeys[i] != ' ' ) {
            	InsertCharToArray(charArray, inputkeys[i]);
            	if ( charArray.length >= 24 ) {
            	    break;
            	}
        	}
        }
    }
  
    // 添加无关干扰词
    var other = new Array('爱','情','公','寓', '包','青','天','流','星','花','园', '鹿','鼎','记', '神','探','狄','仁','杰', 
    					  '天','龙','八','部', '西','游','记','武','林','外','传','甄','嬛','传','碟','中','谍','功','夫','食','神');
    // 随机排序
    other.sort(function(a,b){
               if ( Math.random() > 0.7 ) {
               return 1;
               }
               return -1;
               });
    
    if ( charArray.length < 24 )
        for (var i = 0; i < other.length; i ++) {
            InsertCharToArray(charArray, other[i]);
            if ( charArray.length >= 24 ) {
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

GuessScene.prototype.MakeFeelList = function (feel) {
	this.curFeel = -1;		// 当前的初始表情
	this.feelArray = new Array();
	if ( feel != "" ) {
		var tmp = feel.split(",");
		for (var i = 0; i < tmp.length; i ++ ) {
			var info = tmp[i].split(":");
			var begin = parseInt(info[0]);
			var contin = parseInt(info[1]);
			var status = parseInt(info[2]);
			
			var obj = new Object();
			obj.time = begin;
			obj.status = status;
			this.feelArray.push(obj);
			
			if ( contin != -1 ) {
				obj = new Object;
				obj.time = begin + contin;
				obj.status = -1;
				this.feelArray.push(obj);
			}
		}
	}
};

GuessScene.prototype.onReceivedTestData = function(testObj, guessScene)
{	// 上报数据
    if ( !Global_isWeb() ) {
		var param = memeda.Stat.createParam();
		param.addKeyAndValue("index", ""+gProblem);
		param.addKeyAndValue("aid", ""+testObj.id);	
		param.addKeyAndValue("source", ""+gSource);
        param.addKeyAndValue("question", gProblemProject);
            
		memeda.Stat.logEvent("guess", param);
    }
	//
    
	debugMsgOutput ( " feel " + testObj.feel );
	gCurrentCCBView.MakeFeelList(testObj.feel);

	gBuyList = new Array();

    debugMsgOutput("onReceivedTestData");
    gCurrentTestObj = testObj;

    debugMsgOutput(gCurrentTestObj.inputkey);

    var i = 0;
    var inputKeys = testObj.inputkey;
    gCurrentCCBView.clearInputCharsAndResultChars();

    // 构造一个包含inputKeys和rightanswer中字符的字符串，长度为24
    inputKeys = MakeInputKeys(gCurrentTestObj.rightanswer, inputKeys);
    
    if ( gResultCharAllButtons.length == 0 )
    {
        gResultCharAllButtons[0] = gCurrentCCBView.charButtonResult0;
        gResultCharAllButtons[1] = gCurrentCCBView.charButtonResult1;
        gResultCharAllButtons[2] = gCurrentCCBView.charButtonResult2;
        gResultCharAllButtons[3] = gCurrentCCBView.charButtonResult3;
        gResultCharAllButtons[4] = gCurrentCCBView.charButtonResult4;
        gResultCharAllButtons[5] = gCurrentCCBView.charButtonResult5;
    }
    debugMsgOutput("gResultCharAllButtons.length " + gResultCharAllButtons.length);
	// 初始化背景,给背景和文字框选择合适的背景
	// 1.红色，2.黄色，3.蓝色
	gCurrentCCBView.AdjuestDoorColor();
    //
    
	gCurrentCCBView.InitInputAndResultChar(gCurrentTestObj.rightanswer, gCurrentTestObj.inputkeys);
    
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
    if ( Global_isWeb() ) {
    	gMusicURL = "../problem/music/" + gCurrentTestObj.id + ".mp3";
    } else {
    	gMusicURL = "problem/music/" + gCurrentTestObj.id + ".mp3";
    }
    debugMsgOutput("Music " + gMusicURL);
    
    gCurrentCCBView.CatEnter();
    
    gCurrentCCBView.SetTitleNum(gProblem + 1);
    choosedButtonCount = 0;

    for(i = 0; i < gInputCharButtons.length; i++)
    {
        gInputCharButtons[i].controller.SetIndexNumber(i);
        if(i < inputKeys.length)
        {
            gInputCharButtons[i].controller.show(true);
        }
        else
        {
            gInputCharButtons[i].controller.show(false);
        }

		gInputCharButtons[i].controller.AttachClickEvent(function (obj) {
     		if ( !gAllBtnEnable ) {
                debugMsgOutput("Input Disable");
                return;				
			}
      
            var sourceIndex = obj.GetIndexNumber();
                
            debugMsgOutput("choosedButtonCount " + choosedButtonCount + "  gResultCharButtons.length  " + gResultCharButtons.length);
            
            debugMsgOutput("choosedButtons.length " + choosedButtons.length);      
            if(choosedButtonCount < gResultCharButtons.length && gInputCharButtons[sourceIndex].controller.isShow())
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
           

                choosedButtons[choosedIndex] = gInputCharButtons[sourceIndex];
                choosedCharStrings[choosedIndex] = gInputCharButtons[sourceIndex].controller.getText();
                choosedButtons[choosedIndex].sourceButtonIndex = sourceIndex;
                choosedButtonCount++;

                if(true)
                {   // 播放音乐
                    cc.AudioEngine.getInstance().playEffect("sounds/Click_Wood_OK.mp3");
                    //gInputCharButtons[sourceIndex].setVisible(false);
                }
                
                // 调整z序
                for ( var i = 0; i < gInputCharButtons.length; i ++ ) {
                	gCurrentCCBView.inputCharBoard.reorderChild(gInputCharButtons[i], 0);	
                }
                
                gCurrentCCBView.inputCharBoard.reorderChild(gInputCharButtons[sourceIndex], 1);	
                
                debugMsgOutput ( "z-order : " + "  " + gInputCharButtons[sourceIndex].getZOrder());
                	
                gInputCharButtons[sourceIndex].controller.show(false);
				gResultCharButtons[choosedIndex].controller.setText(choosedCharStrings[choosedIndex]);
				
				gCurrentCCBView.updateInputCharsAndResultChars();
            }
        });
    }

    for(i = 0; i < gResultCharButtons.length; i++)
    {
    	gResultCharButtons[i].controller.SetIndexNumber(i);
    	gResultCharButtons[i].controller.AttachClickEvent(gCurrentCCBView.onClickResultBtn);
    }
};

GuessScene.prototype.setupInputCharsAndResultChars = function (index)
{
    debugMsgOutput("setupInputCharsAndResultChars");
    Problem_RequestInfo(index, this.onReceivedTestData,null,this);
};

GuessScene.prototype.updateInputCharsAndResultChars = function (showAni)
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

    if(choosedButtonCount >= gResultCharButtons.length)
    {
        if(this.checkAnswer(resultString,gCurrentTestObj.rightanswer))
        {
            // 上报数据
            if ( !Global_isWeb() ) {
            	var param = memeda.Stat.createParam();
            	param.addKeyAndValue("index", ""+gProblem);
            	param.addKeyAndValue("aid", ""+gCurrentTestObj.id);
                param.addKeyAndValue("question", gProblemProject);
                    
            	memeda.Stat.logEvent("guesssuccess", param);
            }
            //
            
            debugMsgOutput("答对了！");
            try {
            	if(cc.AudioEngine.getInstance().isMusicPlaying()) {
					cc.AudioEngine.getInstance().stopMusic();
                    cc.AudioEngine.getInstance().setMusicVolume(0.0);
				}
            } catch (e) {
            }
            
            var isFirst = false;
            if ( !Problem_isAnswerRight(gCurrentTestObj.id) ) {
            	// 第一次答对
            	Question_answerRight(gCurrentTestObj.id);
            	isFirst = true;
            }
            
            this.clearInputAndResultChar();
            this.rootNode.animationManager.runAnimationsForSequenceNamed("Default Timeline");	
            this.catAni.controller.Leave();
            this.bgLayer.controller.setPlay(false);
            
            var url = null;
            if ( gCurrentTestObj.knowledgeTips != null ) {
            	url = gCurrentTestObj.knowledgeTips.url;
            }

            cc.AudioEngine.getInstance().playEffect("sounds/RightAnswer.mp3");
            this.EnableAllBtn(false);
            debugMsgOutput("aaa " + gCurrentTestObj.label);
            debugMsgOutput("bbb " + gCurrentTestObj.rightanswer);
            
            if ( this.answerRight == null ) {
            	this.answerRight = cc.BuilderReader.load("RightMsgBox");
    			this.answerRightLayout.addChild(this.answerRight);	
            }
            
            this.answerRight.controller.ShowMsg(gCurrentTestObj.id, gCurrentTestObj.label, gCurrentTestObj.rightanswer, url, isFirst, this.onClickNext);
            
            if ( gProblem + 1 == Problem_GetCount() ) {
                var color = GetColorByFloor(0, 0);
                GuessScene_SetFloorInfo(0, 3, color);
            } else {
                var index = gProblem + 1;
                var color = GetColorByFloor(Math.floor(index / 3), index % 3);
                GuessScene_SetFloorInfo(gProblem + 1, 3, color);
            }
            
            gCurrentCCBView.AdjuestDoorColor();
        }
        else if ( showAni != false )
        {
            // 上报数据
            if ( !Global_isWeb() ) {
            	var param = memeda.Stat.createParam();
            	param.addKeyAndValue("index", ""+gProblem);
            	param.addKeyAndValue("aid", ""+gCurrentTestObj.id);
                param.addKeyAndValue("question", gProblemProject);
                    
            	memeda.Stat.logEvent("guesserror", param);
            }
            
            //
		    for(i = 0; i < gResultCharButtons.length; i++)
		    {
				gResultCharButtons[i].controller.flush();
		    }

            cc.AudioEngine.getInstance().playEffect("sounds/WrongAnswer.mp3");
            debugMsgOutput("可惜答错了，再接再厉！");
        }
    }
};

GuessScene.prototype.clearInputAndResultChar = function () { 
    for(i = 0; i < gInputCharButtons.length; i++)
    {
    	gInputCharButtons[i].controller.show(true);
        gInputCharButtons[i].controller.setText("");
        gInputCharButtons[i].controller.setStatus(false);	// 按钮不可点击
    }

    for(i = 0; i < gResultCharButtons.length; i++)
    {
        gResultCharButtons[i].controller.setText("");
        gResultCharButtons[i].controller.Hide();
    }	
}

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
}

GuessScene.prototype.CheckFeel = function () {
	if ( this.feelArray.length > 0  && this.Entered) {
		// 判断表情变化	
    	for ( var i = this.feelArray.length - 1; i >= 0; i -- ) {
    		var obj = this.feelArray[i];
    		var curTime = (new Date()).getTime();
    		curTime = 1.0 * (curTime - this.beginPlayTime) / 1000;
    		if ( curTime >= obj.time ) {
    			if ( this.curFeel != obj.status ) {
    				// 修改表情
                    debugMsgOutput("time " + (curTime - obj.time));
    				this.catAni.controller.setStatus(obj.status);
    				this.curFeel = obj.status;
    			}
    			
    			break;	
    		}
    	}    
    }
};

GuessScene.prototype.update = function() {
    gTimeCount ++;
    if ( gTimeCount >= 10 ) {
        if ( !cc.AudioEngine.getInstance().isMusicPlaying() ) {
            gCurrentCCBView.onMusicStop();
            try {
            	cc.AudioEngine.getInstance().setMusicVolume(0.0);
            	cc.AudioEngine.getInstance().stopMusic();
            }catch ( e ) {
            }
            
            cc.Director.getInstance().getScheduler().unscheduleUpdateForTarget(this);
        }
        gTimeCount = 0;
    }
    gCurrentCCBView.CheckFeel();
}

GuessScene.prototype._isRunning = function () {
    return true;
}

GuessScene.prototype.PlayMusic = function () {
    cc.Director.getInstance().getScheduler().unscheduleUpdateForTarget(this);
    
    try {
    	if ( cc.AudioEngine.getInstance().isMusicPlaying() ) {
    		cc.AudioEngine.getInstance().stopMusic();
            cc.AudioEngine.getInstance().setMusicVolume(0.0);
    	}
        debugMsgOutput("... playMusic  ");
   	 	cc.AudioEngine.getInstance().playMusic(gMusicURL, false);
    	cc.AudioEngine.getInstance().setMusicVolume(0.9);
    } catch (e) {
    }
}

GuessScene.prototype.onMusicStop = function () {
	this.catAni.controller.Listen(false);
	this.bgLayer.controller.setPlay(false);
}

GuessScene.prototype.CatEnter = function () {
	this.PlayMusic();
    this.Entered = false;
    
    this.bgLayer.controller.setPlay(true);
	this.catAni.controller.Enter(this.onEnterCompleted, this);
}

GuessScene.prototype.ListenMusic = function () {
	this.PlayMusic();
	
   	this.curFeel = -1;
	this.beginPlayTime = (new Date()).getTime();
	
    cc.Director.getInstance().getScheduler().scheduleUpdateForTarget(this, 0, !this._isRunning);
    
	this.catAni.controller.Listen(true);
	this.bgLayer.controller.setPlay(true);
}
    
    
GuessScene.prototype.onClickReplay = function (obj) {
	// 重放
    obj.ListenMusic();  	
}

GuessScene.prototype.onClickCat = function (obj) {
    try {
    	cc.AudioEngine.getInstance().setMusicVolume(0.0);
    	cc.AudioEngine.getInstance().stopMusic();
    }catch ( e ) {
    }
};

GuessScene.prototype.onEnterCompleted = function(obj) {
    obj.Entered = true;
    
   	obj.curFeel = -1;
	obj.beginPlayTime = (new Date()).getTime();
	
    cc.Director.getInstance().getScheduler().scheduleUpdateForTarget(obj, 0, !obj._isRunning);
    
    debugMsgOutput("GuessScene.prototype.onEnterCompleted");
	obj.rootNode.animationManager.runAnimationsForSequenceNamed("Drawing Animation Timeline");	
	for ( var i = 0; i < gInputCharButtons.length; i ++ ) {
		gInputCharButtons[i].controller.setStatus(true);	
	}
	
    for(i = 0; i < gResultCharButtons.length; i++)
    {
    	gResultCharButtons[i].controller.Show();
    }
}

GuessScene.prototype.ClickBuy = function () {
	if ( !gAllBtnEnable ) {
		return ;
	}
	
	var price = new Array(50, 50, 100, 100, 200, 200);
	this.EnableAllBtn(false);
	debugMsgOutput("gBuyList.length " + this.getBuyCount());
	var count = this.getBuyCount();
	
	if ( this.buyMsg == null ) {
		this.buyMsg = cc.BuilderReader.load("BuyMsg");
	    this.buyMsg.controller.noEnoughEvent = this.showNoCoinMsgBox;	
    	this.ccbLayout.addChild(	this.buyMsg );
	}
	
	this.buyMsg.controller.ShowMsg(price[count], "第" + (count + 1) + "个字", this.onBuyMsgEnd, count + 1);
}

GuessScene.prototype.onClickResultBtn = function (obj, playmusic) {
    if ( !gAllBtnEnable ) {
        return;				
	}
		

    debugMsgOutput("Result");

    var choosedIndex = obj.GetIndexNumber();

    if(choosedButtons[choosedIndex] != emptyButton) {
        var sourceIndex = choosedButtons[choosedIndex].sourceButtonIndex;

        choosedButtons[choosedIndex] = emptyButton;
        choosedCharStrings[choosedIndex] = "";
        choosedButtonCount--;

		if ( playmusic != false ) {
        	cc.AudioEngine.getInstance().playEffect("sounds/Click_Wood_Cancel.mp3");
		}
		
		gInputCharButtons[sourceIndex].controller.show(true);
        gCurrentCCBView.updateInputCharsAndResultChars();
    }
}

GuessScene.prototype.getBuyCount = function () {
	var count = 0;
	for (  var key in gBuyList ) {
		count ++;	
	}
	
	return count;
};
        
GuessScene.prototype.isBuy = function (index) {
	for ( var key in gBuyList ) {
		debugMsgOutput("isBuy " + key + "  index " + index);
		if ( key == "_" + index ) { 
			debugMsgOutput("isBuy true");
			return true;	
		}
	}
	debugMsgOutput("isBuy false");
	return false;
};

GuessScene.prototype.showResultChar = function ( resultIndex, resultChar) {
	var inputIndex = -1;
		
	for ( var i = 0; i < gInputCharButtons.length; i ++ ) {
		if ( gInputCharButtons[i].controller.isShow() &&
				gInputCharButtons[i].controller.getText() == resultChar ) {
			inputIndex = i;
			break;		
		}
	}
		
	if ( inputIndex == -1 ) {
		// 	错字正在使用
		var tmp = null;
		for (var i = 0; i < gResultCharButtons.length; i ++ ) {
			if ( gResultCharButtons[i].controller.getText() == resultChar ) {
				tmp = gResultCharButtons[i].controller;
				break;
			}
		}
		gCurrentCCBView.onClickResultBtn(tmp, false);
			
		for ( var i = 0; i < gInputCharButtons.length; i ++ ) {
			if ( gInputCharButtons[i].controller.isShow() &&
					gInputCharButtons[i].controller.getText() == resultChar ) {
				inputIndex = i;
				break;		
			}
		}
	}

	if ( choosedButtons[resultIndex] != emptyButton ) {
		var sourceIndex = choosedButtons[resultIndex].sourceButtonIndex;
		choosedButtons[resultIndex] = emptyButton;			
		choosedCharStrings[resultIndex] = "";
        choosedButtonCount--;

        gInputCharButtons[sourceIndex].controller.show(true);
	}
                      
    choosedButtons[resultIndex] = gInputCharButtons[inputIndex];
        
    choosedCharStrings[resultIndex] = gInputCharButtons[inputIndex].controller.getText();
    choosedButtons[resultIndex].sourceButtonIndex = inputIndex;

    choosedButtonCount++;
        
    gInputCharButtons[inputIndex].controller.show(false);
        
    gCurrentCCBView.updateInputCharsAndResultChars(false);
		
	gResultCharButtons[resultIndex].controller.flush();
};

GuessScene.prototype.onBuyMsgEnd = function (res) {
	gCurrentCCBView.EnableAllBtn(true);
	if ( res == 1 ) {
		// 查找第一个错字并且是没有购买过的位置
		var answer = gCurrentTestObj.rightanswer;
		
		for (var i = 0; i < gResultCharButtons.length; i ++ ) {
			if ( gResultCharButtons[i].controller.getText() != answer[i] ) {
				// 判断是否购买过
				if ( gCurrentCCBView.isBuy(i) ) {
					gCurrentCCBView.showResultChar(i, answer[i]);
				} else {
					gCurrentCCBView.showResultChar(i, answer[i]);
					gBuyList["_" + i] = 1;	// 添加到购买队列中
					break;	
				}
			}
		}
	}
}

	// 初始化背景,给背景和文字框选择合适的背景
	// 1.红色，2.黄色，3.蓝色
GuessScene.prototype.AdjuestDoorColor = function () {
	if ( gColor.bg == "floor_blue" ) {
    	gFlippingIndex = 3;
	} else if ( gColor.bg == "floor_pink" ) {
    	gFlippingIndex = 1;		
	} else {
		gFlippingIndex = 2;
	}
	var doorColor = 2;
	if ( gColor.door == "door_blue" ) {
		doorColor = 3;
	} else if ( gColor.door == "door_pink" ) {
		doorColor = 1;
	} else if ( gColor.door == "door_black" ) {
		doorColor = 4;
	} else {
		doorColor = 2;
	}
	
    gCurrentCCBView.bgLayer.controller.setBkg(gFlippingIndex, doorColor);
	
	debugMsgOutput("gResultCharAllButtons.length " + gResultCharAllButtons.length);
    for (var i = 0; i < gResultCharAllButtons.length; i ++) {
        gResultCharAllButtons[i].controller.setImage(gFlippingIndex);
        gResultCharAllButtons[i].controller.setNone();
        gResultCharAllButtons[i].controller.Hide();
    }
}    //

GuessScene.prototype.onClickNext = function() {
	gCurrentCCBView.EnableAllBtn(true);
	gCurrentCCBView.setupInputCharsAndResultChars(gProblem);
}

GuessScene.prototype.EnableAllBtn = function (enable) {
	debugMsgOutput("EnableAllBtn " + enable);
	gAllBtnEnable = enable;
	
	//this.coinBtn.setEnabled(enable);
	//this.returnBtn.setEnabled(enable);
	//this.chatShare.setEnabled(enable);
}; 

GuessScene.prototype.onClickedWeChatShare = function () {
	if ( !gAllBtnEnable ) {
		return ;
	}
	
	this.EnableAllBtn(false);
	if ( this.weChatMsg == null ) {
		this.weChatMsg = cc.BuilderReader.load("WeChatMsg");
    	this.ccbLayout.addChild(this.weChatMsg);	
	}
	
    this.weChatMsg.controller.ShowMsg(gCurrentTestObj.id, function (err) {
		gCurrentCCBView.EnableAllBtn(true);
		debugMsgOutput("showmsg " + err);
		if ( err != null ) {
			if ( msg.indexOf("安装") > 0 ) {
				gCurrentCCBView.wechatError.controller.ShowMsg(err, function () {
				});
			}
		}
    }, 
    function () {
    	gCurrentCCBView.checkExtraCoin();
    });
};

GuessScene.prototype.onClickJump = function () {
	if ( !gAllBtnEnable ) {
		return ;
	}
	
	this.EnableAllBtn(false);
	
	if ( this.jumpMsg == null ) {
		this.jumpMsg = cc.BuilderReader.load("JumpMsgBox");
    	this.ccbLayout.addChild(this.jumpMsg);
    	
	    this.jumpMsg.controller.noEnoughEvent = this.showNoCoinMsgBox;	
	}
	
	this.jumpMsg.controller.ShowMsg(200, gCurrentTestObj.id, function (res) {
		if ( res == 1 ) {
			// 跳过该题，进入下一题
			if ( !Problem_isAnswerRight(gCurrentTestObj.id) ) {
				Question_jump(gCurrentTestObj.id);
			}
		
    		if ( gProblem + 1 == Problem_GetCount() ) {
   				var color = GetColorByFloor(0, 0);
				GuessScene_SetFloorInfo(0, 4, color);
    		} else {
    			var index = gProblem + 1;
   				var color = GetColorByFloor(Math.floor(index / 3), index % 3);
        		GuessScene_SetFloorInfo(gProblem + 1, 4, color);
    		}
    
			gCurrentCCBView.EnableAllBtn(true);
			gCurrentCCBView.setupInputCharsAndResultChars(gProblem);
		} else {
			gCurrentCCBView.EnableAllBtn(true);
		}
	});
}

GuessScene.prototype.checkExtraCoin = function () {
	var showsharecoin = sys.localStorage.getItem("showsharecoin");
	if ( showsharecoin == "1" ) {
		sys.localStorage.setItem("showsharecoin", "2");	// 准备显示第一次分享奖励
		gCurrentCCBView.EnableAllBtn(false);
		
		if ( this.weChatCoinMsgBox == null ) {
			this.weChatCoinMsgBox = cc.BuilderReader.load("WeChatCoinMessageBox");
    		this.ccbLayout.addChild(	this.weChatCoinMsgBox );
		}
		
		this.weChatCoinMsgBox.controller.show(function () {
			gCurrentCCBView.EnableAllBtn(true);
			cc.AudioEngine.getInstance().playEffect("sounds/Click_Pay_Coins.mp3");
			CoinMgr_Change(200);
		});
	}
}

GuessScene.prototype.onClickedCoinButton = function (obj ) {
	if ( !gAllBtnEnable ) {
		return ;
	}
	
    debugMsgOutput("[UI Event] Clicked Coin Button!");
    if ( obj.buyCoinMsgBox == null ) {
    	debugMsgOutput("create BuyCoinMessageBox");
    	obj.buyCoinMsgBox = cc.BuilderReader.load("BuyCoinMessageBox");
    	obj.ccbLayout.addChild(	obj.buyCoinMsgBox );
    }
    
    obj.buyCoinMsgBox.controller.show();	
}

GuessScene.prototype.showNoCoinMsgBox = function ( src ) {
	gCurrentCCBView.EnableAllBtn(false);
	
	if ( gCurrentCCBView.noCoinMsgBox == null ) {
    	gCurrentCCBView.noCoinMsgBox = cc.BuilderReader.load("NoEnoughMessageBox");
    	gCurrentCCBView.ccbLayout.addChild(	gCurrentCCBView.noCoinMsgBox );
	}
	
	gCurrentCCBView.noCoinMsgBox.controller.show(src, function (res) { 
		gCurrentCCBView.EnableAllBtn(true);
		if ( res == 1 ) {
    		debugMsgOutput("[UI Event] Clicked Coin Button!");
    		if ( gCurrentCCBView.buyCoinMsgBox == null ) {
    			debugMsgOutput("create BuyCoinMessageBox");
    			gCurrentCCBView.buyCoinMsgBox = cc.BuilderReader.load("BuyCoinMessageBox");
    			gCurrentCCBView.ccbLayout.addChild(	gCurrentCCBView.buyCoinMsgBox );
    		}
    
    		gCurrentCCBView.buyCoinMsgBox.controller.show();	
		}
	});
}