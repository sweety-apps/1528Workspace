var Clouds = function() {};

Clouds.prototype.onDidLoadFromCCB = function () {
    this.rootNode.animationManager.setCompletedAnimationCallback(this,this.onFinishedAnimation);
};

Clouds.prototype.onFinishedAnimation = function() {
    this.rootNode.animationManager.runAnimationsForSequenceNamed("Animation Timeline");
};