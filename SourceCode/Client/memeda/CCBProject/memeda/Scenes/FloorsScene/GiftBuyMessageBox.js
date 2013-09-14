//
// GiftBuyMessageBox class
//

var GiftBuyMessageBox = function() {
};

GiftBuyMessageBox.prototype.onDidLoadFromCCB = function () {
    // 设备上面需要开启触摸
    if( 'touches' in sys.capabilities )
        this.rootNode.setTouchEnabled(true);
};

GiftBuyMessageBox.prototype.onClickedBuy = function () {
    debugMsgOutput("Buy Clicked!");
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Dismiss Animation Timeline");
};

GiftBuyMessageBox.prototype.onClickedClose = function () {
    debugMsgOutput("Close Clicked!");
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Dismiss Animation Timeline");
};