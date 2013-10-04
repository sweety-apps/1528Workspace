//
// GiftBuyMessageBox class
//

var GiftBuyMessageBox = function() {
};

GiftBuyMessageBox.prototype.onDidLoadFromCCB = function () {
    // 设备上面需要开启触摸
    if( 'touches' in sys.capabilities )
        this.rootNode.setTouchEnabled(true);

    //this.setFinishedPercents(100);
};

GiftBuyMessageBox.prototype.onBuyCallbackTarget = null;
GiftBuyMessageBox.prototype.onBuyCallbackMethod = null;

GiftBuyMessageBox.prototype.onClickedBuy = function () {
    debugMsgOutput("Buy Clicked!");
    if(!Global_isWeb())
    {
        if(this.onBuyCallbackMethod != null && this.onBuyCallbackMethod != undefined)
        {
            if(this.onBuyCallbackTarget != null && this.onBuyCallbackTarget != undefined)
            {
                this.onBuyCallbackTarget.onBuyCallbackMethodTmp = this.onBuyCallbackMethod;
                this.onBuyCallbackTarget.onBuyCallbackMethodTmp();
                this.onBuyCallbackTarget.onBuyCallbackMethodTmp = null;
            }
            else
            {
                this.onBuyCallbackMethod();
            }
        }
    }
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Dismiss Animation Timeline");
};

GiftBuyMessageBox.prototype.onClickedClose = function () {
    debugMsgOutput("Close Clicked!");
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Dismiss Animation Timeline");
};

GiftBuyMessageBox.prototype.setFinishedPercents = function (numberOfPercents) {
    if(numberOfPercents > 100)
    {
        numberOfPercents = 100;
    }
    if(numberOfPercents < 0)
    {
        numberOfPercents = 0;
    }
    var digit100 = Math.floor(numberOfPercents/100);
    var digit10 = Math.floor((numberOfPercents%100)/10);
    var digit1 = Math.floor((numberOfPercents%10));

    cc.log("setPercents "+digit100+","+digit10+","+digit1);

    var image;
    var spriteFrame;
    var rect;

    rect = this.percent100Num.getTextureRect();
    image = "UI/levels/buyMsgBoxNums_" + digit100 + ".png";
    spriteFrame = cc.SpriteFrame.create(image, rect);
    this.percent100Num.setDisplayFrame(spriteFrame);
    if(digit100 == 0)
    {
        this.percent100Num.setVisible(false);
    }
    else
    {
        this.percent100Num.setVisible(true);
    }

    rect = this.percent10Num.getTextureRect();
    image = "UI/levels/buyMsgBoxNums_" + digit10 + ".png";
    spriteFrame = cc.SpriteFrame.create(image, rect);
    this.percent10Num.setDisplayFrame(spriteFrame);
    if(digit100 == 0 && digit10 == 0)
    {
        this.percent10Num.setVisible(false);
    }
    else
    {
        this.percent10Num.setVisible(true);
    }

    rect = this.percent1Num.getTextureRect();
    image = "UI/levels/buyMsgBoxNums_" + digit1 + ".png";
    spriteFrame = cc.SpriteFrame.create(image, rect);
    this.percent1Num.setDisplayFrame(spriteFrame);

    if(numberOfPercents < 10)
    {
        this.percentBackLayer.setAnchorPoint(cc.p(0.66,0.5));
    }
    else if(numberOfPercents < 100)
    {
        this.percentBackLayer.setAnchorPoint(cc.p(0.58,0.5));
    }
    else
    {
        this.percentBackLayer.setAnchorPoint(cc.p(0.5,0.5));
    }

    //self.percent100Num
};

