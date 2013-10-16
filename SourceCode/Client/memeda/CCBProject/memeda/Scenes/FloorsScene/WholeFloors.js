//
// WholeFloors class
//

var kFloorStateWaiting = 0;
var kFloorStateCatMoving = 1;

var gHasShowedUFOLight = false;

var WholeFloors = function() {
};

WholeFloors.prototype.getCatStayAtDoorNum = function () {
	return this.currentCatStayAtDoorNum;
}

WholeFloors.prototype.getCatStayAtFloorNum = function () {
	return this.currentCatStayAtFloorNum;
}
    
WholeFloors.prototype.onDidLoadFromCCB = function () {

    // 设备上面需要开启触摸
    if( 'touches' in sys.capabilities )
        this.rootNode.setTouchEnabled(true);
        
    //var Floor0 = this.rawFloor0;
    //debugMsgOutput(Floor0.toString());
    //Floor0.controller.doorCover1.setVisible(false);

    FloorsData_resetTestData();
    this.InitWholeFloors();
};

WholeFloors.prototype.InitWholeFloors = function ()
{
    var width = this.rootLayer.getContentSize().width;
    var height = this.rootLayer.getContentSize().height;
    debugMsgOutput("[Whole Floors Init] width = "+width + " ,height = "+height);
    //this.rootLayer.setContentSize(this.rootLayer.getContentSize().width, 1080);

    this.startFloorOffsetY = this.rawFloor0.getPositionY();
    this.floorHeight = this.rawFloor1.getPositionY() - this.rawFloor0.getPositionY();
    this.floorQueue = new Array();
    this.floorFrontQueue = new Array();
    this.preUpdateY = this.floorHeight*2;

    this.floorQueue[0] = this.rawFloor1;
    this.floorQueue[1] = this.rawFloor2;
    this.floorQueue[2] = this.rawFloor3;
    this.floorQueue[3] = this.rawFloor4;
    this.floorQueue[4] = this.rawFloor5;
    this.floorQueue[5] = this.rawFloor6;
    this.floorQueue[6] = this.rawFloor7;
    this.floorQueue[7] = this.rawFloor8;
    this.floorQueue[8] = this.rawFloor9;

    this.floorFrontQueue[0] = this.rawFloorFront1;
    this.floorFrontQueue[1] = this.rawFloorFront2;
    this.floorFrontQueue[2] = this.rawFloorFront3;
    this.floorFrontQueue[3] = this.rawFloorFront4;
    this.floorFrontQueue[4] = this.rawFloorFront5;
    this.floorFrontQueue[5] = this.rawFloorFront6;
    this.floorFrontQueue[6] = this.rawFloorFront7;
    this.floorFrontQueue[7] = this.rawFloorFront8;
    this.floorFrontQueue[8] = this.rawFloorFront9;

    this.allFloors = new Array();
    this.allFloorFronts = new Array();
    for(var i = 0; i < gTestFloor.length; i++)
    {
        this.allFloors[i] = this.floorQueue[i%(this.floorQueue.length)];
        this.allFloorFronts[i] = this.floorFrontQueue[i%(this.floorFrontQueue.length)];
        this.allFloors[i].controller.onClickedDoorCallbackObject = this;
        this.allFloors[i].controller.floorNumber = i;
        this.allFloors[i].controller.onClickedDoorCallback = function(floor,doorNum) {
            this.onClickedDoorCallbackObject.onClickedDoor(floor,this.floorNumber,doorNum);
        };
    }
    var offY = this.startFloorOffsetY;
    for(var i = 0; i < gTestFloor.length; i++)
    {
        gTestFloor[i].offsetY = offY;
        offY += this.floorHeight;
    }

    //一些2B变量
    this.doorRect = cc.rect(0,0,58,76);
    this.floorRect = cc.rect(0,0,320,138);

    this.rootLayer.setContentSize(cc.size(width,this.CalculateHeight()+this.startFloorOffsetY));
};

WholeFloors.prototype.UninitWholeFloors = function ()
{

};

WholeFloors.prototype.UpdateWholeFloors = function (scrollView)
{
    //购买消息框
    var height = this.rootLayer.getContentSize().height;
    //this.buyMsgBox.setPositionY(height - 100);

    //楼层复用
    var containerHeight = scrollView.getContentSize().height;
    var scrolledY = -scrollView.getContentOffset().y;
    var scrollViewHeight = scrollView.getViewSize().height;

    var currentVisibleY = scrolledY - this.preUpdateY;
    var currentVisibleFloorNum = Math.floor((currentVisibleY - this.startFloorOffsetY)/this.floorHeight);
    if(currentVisibleFloorNum < 0)
    {
        currentVisibleFloorNum = 0;
    }

    debugMsgOutput("[Floor Current Num] = F "+ currentVisibleFloorNum);

    //只刷新能看到的8层楼
    for(var i = 0; i < 8; i++)
    {
        var floorNum = currentVisibleFloorNum + i;
        if(floorNum < gTestFloor.length)
        {
            var floor = this.allFloors[floorNum];
            var floorFront = this.allFloorFronts[floorNum];
            floor.setPositionY(gTestFloor[floorNum].offsetY);
            floorFront.setPositionY(gTestFloor[floorNum].offsetY);
            //floor.controller.door1.setSpriteFrame();
            //debugMsgOutput("[Floor Texture] = "+ floor.controller.doorCover1.getTexture().getName());
            var imageUrl;
            var spriteFrame;

            imageUrl = "UI/levels/"+gTestFloor[floorNum].doors[0].image + ".png";
            spriteFrame = cc.SpriteFrame.create(imageUrl,this.doorRect);
            floor.controller.door1.setDisplayFrame(spriteFrame);

            imageUrl = "UI/levels/"+gTestFloor[floorNum].doors[1].image + ".png";
            spriteFrame = cc.SpriteFrame.create(imageUrl,this.doorRect);
            floor.controller.door2.setDisplayFrame(spriteFrame);

            imageUrl = "UI/levels/"+gTestFloor[floorNum].doors[2].image + ".png";
            spriteFrame = cc.SpriteFrame.create(imageUrl,this.doorRect);
            floor.controller.door3.setDisplayFrame(spriteFrame);

            imageUrl = "UI/levels/"+gTestFloor[floorNum].bg + ".png";
            spriteFrame = cc.SpriteFrame.create(imageUrl,this.floorRect);
            floor.controller.bgWall.setDisplayFrame(spriteFrame);

            imageUrl = "UI/levels/"+gTestFloor[floorNum].bottom + ".png";
            spriteFrame = cc.SpriteFrame.create(imageUrl,this.floorRect);
            floorFront.controller.bottom.setDisplayFrame(spriteFrame);

            floor.controller.floorNumber = floorNum;
            floor.controller.doorNum1.setString(gTestFloor[floorNum].doors[0].doorNum);
            floor.controller.doorNum2.setString(gTestFloor[floorNum].doors[1].doorNum);
            floor.controller.doorNum3.setString(gTestFloor[floorNum].doors[2].doorNum);
            floor.controller.doorCover1.setVisible(!gTestFloor[floorNum].doors[0].hasFinished);
            floor.controller.doorCover2.setVisible(!gTestFloor[floorNum].doors[1].hasFinished);
            floor.controller.doorCover3.setVisible(!gTestFloor[floorNum].doors[2].hasFinished);
            floorFront.controller.floorNum.setString(gTestFloor[floorNum].floorNum);
            floorFront.controller.floorSpecialText.setString(gTestFloor[floorNum].specText);

            //floor.setPositionY();
        }
    }
};

function GetColorByFloor (floor, num) {
	var obj = new Object();
	obj.bg = gTestFloor[floor].bg;
	obj.door = gTestFloor[floor].doors[num].image;
	return obj;
};

WholeFloors.prototype.CalculateHeight = function ()
{
    return Problem_GetCount() * this.floorHeight;
}

WholeFloors.prototype.onClickedDoor = function(floor, floorNum, doorNum)
{
    var offsetY = floor.rootNode.getPositionY();
    debugMsgOutput("Clicked Floor Y="+offsetY+" doorNum="+doorNum);
    var floorData = gTestFloor[floorNum];
    if(!floorData.doors[doorNum - 1].hasFinished)
    {
        if(this.onFinishedClickedDoorAnimation != null && this.onFinishedClickedDoorAnimation != undefined)
        {
            this.onFinishedClickedDoorAnimation(false,floorNum, doorNum);
        }
    }
    else
    {
        this.doLiftAnimationTo(offsetY,doorNum,floorNum,true,this.onFinishedDoLiftAnimation,this);
    }
}

WholeFloors.prototype.onFinishedDoLiftAnimation = function()
{
    if(this.onFinishedClickedDoorAnimation != null && this.onFinishedClickedDoorAnimation != undefined)
    {
        this.onFinishedClickedDoorAnimation(true,this.currentCatStayAtFloorNum, this.currentCatStayAtDoorNum);
    }
};

// 猫猫移动动画
WholeFloors.prototype.doLiftAnimationTo = function(offsetY, doorNum,floorNum,showAnimation,callBack,target)
{
    if(this.sceneState != kFloorStateCatMoving)
    {
        this.sceneState = kFloorStateCatMoving;
        if(callBack != null && callBack != undefined)
        {
            this.onCatMovedToDoorCallback = callBack;
            this.onCatMovedToDoorCallbackTarget = target;
        }
        else
        {
            this.onCatMovedToDoorCallback = null;
            this.onCatMovedToDoorCallbackTarget = null;
        }

        this.onCatAndLiftAnimationCompleted = function() {
            if(this.catAndLift.animationManager.getLastCompletedSequenceName().indexOf("Go Lift Timeline") >= 0/*this.catAndLift.animationManager.getLastCompletedSequenceName() == "Lift Up Timeline"*/)
            {
                this.onMovedLiftCallback = function(data)
                {
                    this.catAndLift.animationManager.runAnimationsForSequenceNamed("Leave Lift Timeline"+this.currentCatStayAtDoorNum);
                }
                this.catAndLift.runAction(
                    cc.Sequence.create(
                        cc.MoveTo.create(0.2,cc.p(this.catAndLift.getPositionX(),offsetY)),
                        cc.CallFunc.create(this.onMovedLiftCallback, this, null)
                    )
                );
            }
            else if(this.catAndLift.animationManager.getLastCompletedSequenceName().indexOf("Fade Timeline") >= 0)
            {
                this.sceneState = kFloorStateWaiting;
                if(this.onCatMovedToDoorCallback != null && this.onCatMovedToDoorCallback != undefined)
                {
                    if(this.onCatMovedToDoorCallbackTarget != null && this.onCatMovedToDoorCallbackTarget != undefined)
                    {
                        this.onCatMovedToDoorCallbackTarget.tmpMovedFinishedCallBack = this.onCatMovedToDoorCallback;
                        this.onCatMovedToDoorCallbackTarget.tmpMovedFinishedCallBack();
                    }
                    else
                    {
                        this.onCatMovedToDoorCallback();
                    }
                }
            }
        };
        this.catAndLift.animationManager.setCompletedAnimationCallback(this, this.onCatAndLiftAnimationCompleted);
        if(showAnimation)
        {
            //this.onDoScrollFloorsToTarget(true,floorNum, doorNum);
            if(this.currentCatStayAtFloorNum == floorNum)
            {
                if(this.currentCatStayAtDoorNum == doorNum)
                {
                    this.catAndLift.animationManager.runAnimationsForSequenceNamed("Fade Timeline"+this.currentCatStayAtDoorNum);
                }
                else
                {
                    this.catAndLift.animationManager.runAnimationsForSequenceNamed("Move Timeline"+this.currentCatStayAtDoorNum+""+doorNum);
                }
            }
            else
            {
                this.catAndLift.animationManager.runAnimationsForSequenceNamed("Go Lift Timeline"+this.currentCatStayAtDoorNum);
            }
        }
        this.currentCatStayAtDoorNum = doorNum;
        this.currentCatStayAtFloorNum = floorNum;
        if(!showAnimation)
        {
            this.catAndLift.setPositionY(offsetY);
            this.catAndLift.animationManager.runAnimationsForSequenceNamed("Stay Timeline"+this.currentCatStayAtDoorNum);
            this.sceneState = kFloorStateWaiting;
        }
    }
};

/////////////////////

WholeFloors.prototype.onPressedDoorCallbackTarget = null;
WholeFloors.prototype.onPressedDoorCallbackMethod = null;

WholeFloors.prototype.onFinishedClickedDoorAnimation = function (isDoorOpened, floorNum, doorNum)
{
    debugMsgOutput("On Clicked floor "+floorNum+" door "+doorNum+" animate finished!");
    if(this.onPressedDoorCallbackMethod != null && this.onPressedDoorCallbackMethod != undefined)
    {
        if(this.onPressedDoorCallbackTarget != null && this.onPressedDoorCallbackTarget != undefined)
        {
            this.onPressedDoorCallbackTarget.onPressedDoorCallbackMethodTmp = this.onPressedDoorCallbackMethod;
            this.onPressedDoorCallbackTarget.onPressedDoorCallbackMethodTmp(isDoorOpened, floorNum, doorNum);
            this.onPressedDoorCallbackTarget.onPressedDoorCallbackMethodTmp = null;
        }
        else
        {
            this.onPressedDoorCallbackMethod(isDoorOpened, floorNum, doorNum);
        }
    }
};

////////////////////

WholeFloors.prototype.setDoorPressedCallback = function (target,callfunc)
{
    this.onPressedDoorCallbackTarget = target;
    this.onPressedDoorCallbackMethod = callfunc;
};

WholeFloors.prototype.onScrollingCallbackTarget = null;
WholeFloors.prototype.onScrollingCallbackMethod = null;

WholeFloors.prototype.onDoScrollFloorsToTarget = function (isDoorOpened, floorNum, doorNum)
{
    debugMsgOutput("--Scroll floor "+floorNum+" door "+doorNum+" animate start!");
    if(this.onScrollingCallbackMethod != null && this.onScrollingCallbackMethod != undefined)
    {
        if(this.onScrollingCallbackTarget != null && this.onScrollingCallbackTarget != undefined)
        {
            this.onScrollingCallbackTarget.onScrollingCallbackMethodTmp = this.onScrollingCallbackMethod;
            this.onScrollingCallbackTarget.onScrollingCallbackMethodTmp(isDoorOpened, floorNum, doorNum);
            this.onScrollingCallbackTarget.onScrollingCallbackMethodTmp = null;
        }
        else
        {
            this.onScrollingCallbackMethod(isDoorOpened, floorNum, doorNum);
        }
    }
};

WholeFloors.prototype.setScrollingCallback = function (target,callfunc)
{
    this.onScrollingCallbackTarget = target;
    this.onScrollingCallbackMethod = callfunc;
};

WholeFloors.prototype.setupCatPosition = function ()
{
    //初始化cat的位置
    this.sceneState = kFloorStateWaiting;
    var problemIndex = Problem_getCurrentIndex();
    this.currentCatStayAtDoorNum = problemIndex%3 + 1;
    this.currentCatStayAtFloorNum = Math.floor(problemIndex/3);
    var offY = this.startFloorOffsetY + (this.currentCatStayAtFloorNum * this.floorHeight);
    this.doLiftAnimationTo(offY,this.currentCatStayAtDoorNum,this.currentCatStayAtFloorNum,false,null,null);
    if(!gHasShowedUFOLight)
    {
        gHasShowedUFOLight = true;
        this.showUFOLight(this.currentCatStayAtFloorNum,this.currentCatStayAtDoorNum)
    }
};

WholeFloors.prototype.getShouldScrollToY = function(scrollViewHeight)
{
    var wholeFloorsHeight = this.rootLayer.getContentSize().height;
    var catPosY = this.catAndLift.getPositionY();
    var catHeight = this.catAndLift.getContentSize().height;
    var startY = this.startFloorOffsetY;

    var shouldYInContainer = (scrollViewHeight - catHeight) / 2;
    var scrollToY = catPosY - shouldYInContainer;
    if(scrollToY < 0)
    {
        scrollToY = 0;
    }
    if((scrollToY + scrollViewHeight) > wholeFloorsHeight)
    {
        scrollToY = wholeFloorsHeight - scrollViewHeight;
    }
    return -scrollToY;
};

WholeFloors.prototype.onUFOLightAnimationCompleted = function()
{
    if(this.UFOFloorFront.animationManager.getLastCompletedSequenceName().indexOf("UFO Light Timeline") >= 0)
    {
        this.catAndLift.setVisible(true);
    }
    if(this.UFOFloorFront.animationManager.getLastCompletedSequenceName().indexOf("UFO Light End Timeline") >= 0)
    {
        this.UFOFloorFront.setVisible(false);
    }
};

WholeFloors.prototype.showUFOLight = function (floorNum,doorNum)
{
    imageUrl = "UI/levels/"+gTestFloor[floorNum].bottom + ".png";
    spriteFrame = cc.SpriteFrame.create(imageUrl,this.floorRect);
    this.catAndLift.setVisible(false);
    this.UFOFloorFront.setPositionY(gTestFloor[floorNum].offsetY);
    this.UFOFloorFront.setVisible(true);
    this.UFOFloorFront.controller.bottom.setDisplayFrame(spriteFrame);
    this.UFOFloorFront.animationManager.setCompletedAnimationCallback(this, this.onUFOLightAnimationCompleted);
    this.UFOFloorFront.animationManager.runAnimationsForSequenceNamed("UFO Light Timeline"+doorNum);
};
