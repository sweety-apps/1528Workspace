//
// MainScene class
//

var MainScene = function() {};

MainScene.prototype.onDidLoadFromCCB = function () {

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
    // Logic Methods
    this.rootNode.controller.onPressButton = function()
	{	
    	// Rotate the label when the button is pressed
    	//this.helloLabel.runAction(cc.RotateBy.create(1,360));
    	this.rootNode.animationManager.runAnimationsForSequenceNamed("UI End Timeline");
	};

    // Start playing looped background music
    cc.AudioEngine.getInstance().setEffectsVolume(0.2);
    //cc.AudioEngine.getInstance().playMusic("sounds/CAT_OP_BG.mp3",true);
};

///// Logic Methods
// Create callback for button
MainScene.prototype.onPressButton = function()
{	
    // Rotate the label when the button is pressed
    //this.helloLabel.runAction(cc.RotateBy.create(1,360));
    this.rootNode.animationManager.runAnimationsForSequenceNamed("UI End Timeline");
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





/*

var CD_LEVEL_WIDTH = 320;
var CD_SCROLL_FILTER_FACTOR = 0.1;
var CD_DRAGON_TARGET_OFFET = 80;

// Accelerometer
var CD_ACCEL_FILTER_FACTOR = 0.25;

var Level = function(){
    this.winSize = cc.Director.getInstance().getWinSize();

    // Used for the low-pass filter on the accelerometer
    this.prevX = 0;
};

Level.prototype.onDidLoadFromCCB = function()
{
    // Forward relevant touch events to controller (this)
    this.rootNode.onTouchesBegan = function( touches, event) {
        this.controller.onTouchesBegan(touches, event);
        return true;
    };
    this.rootNode.onTouchesMoved = function( touches, event) {
        this.controller.onTouchesMoved(touches, event);
        return true;
    };
    this.rootNode.onMouseDragged = function( event) {
        this.controller.onMouseDragged(event);
        return true;
    };

    this.rootNode.onAccelerometer = function( event) {
        this.controller.onAccelerometer(event);
    };

    // Schedule callback
    this.rootNode.onUpdate = function(dt) {
        this.controller.onUpdate();
    };
    this.rootNode.schedule(this.rootNode.onUpdate);
};

//
// Events
//
Level.prototype.onTouchesBegan = function(touches, event)
{
	if (gSettingControlType != CD_CONTROLTYPE_TOUCH) return;
	
    var loc = touches[0].getLocation();
    this.dragon.controller.xTarget = loc.x - gLevelOffsetX;
};

Level.prototype.onTouchesMoved = function(touches, event)
{
	if (gSettingControlType != CD_CONTROLTYPE_TOUCH) return;
	
    var loc = touches[0].getLocation();
    this.dragon.controller.xTarget = loc.x - gLevelOffsetX;
};

Level.prototype.onMouseDragged = function(event)
{
	if (gSettingControlType != CD_CONTROLTYPE_TOUCH) return;
	
    var loc = event.getLocation();
    this.dragon.controller.xTarget = loc.x;
};

Level.prototype.onAccelerometer = function(accelEvent)
{
	if (gSettingControlType != CD_CONTROLTYPE_TILT) return;

    // low pass filter for accelerometer. This makes the movement softer
    var accelX = accelEvent.x * CD_ACCEL_FILTER_FACTOR + (1 - CD_ACCEL_FILTER_FACTOR) * this.prevX;
    this.prevX = accelX;

    var newX = this.winSize.width * accelX + this.winSize.width/2;
    this.dragon.controller.xTarget = newX;
    // cc.log('Accel x: '+ accelEvent.x + ' y:' + accelEvent.y + ' z:' + accelEvent.z + ' time:' + accelEvent.timestamp );
};


// Game main loop
Level.prototype.onUpdate = function(dt)
{
    var i=0;
    var gameObject = null;
    var gameObjectController = null;

    // Iterate though all objects in the level layer
    var children = this.rootNode.getChildren();
    for (i = 0; i < children.length; i++)
    {
        // Check if the child has a controller (only the updatable objects will have one)
        gameObject = children[i];
        gameObjectController = gameObject.controller;
        if (gameObjectController)
        {
            // Update all game objects
            gameObjectController.onUpdate();
            
            var gameObjectPos = cc.pMult(gameObject.getPosition(), 1.0/gScaleFactor);
            var dragonPos = cc.pMult(this.dragon.getPosition(), 1.0/gScaleFactor);

            // Check for collisions with dragon
            if (gameObject !== this.dragon)
            {
                if (cc.pDistance(gameObjectPos, dragonPos) < gameObjectController.radius + this.dragon.controller.radius)
                {
                    gameObjectController.handleCollisionWith(this.dragon.controller);
                    this.dragon.controller.handleCollisionWith(gameObjectController);
                }
            }
        }
    }

    // Check for objects to remove
    for (i = children.length-1; i >=0; i--)
    {
        gameObject = children[i];
        gameObjectController = gameObject.controller;
        if (gameObjectController && gameObjectController.isScheduledForRemove)
        {
            this.rootNode.removeChild(gameObject);
        }
    }

    // Adjust position of the layer so dragon is visible
    var yTarget = CD_DRAGON_TARGET_OFFET - this.dragon.getPosition().y;
    var oldLayerPosition = this.rootNode.getPosition();

    var xNew = oldLayerPosition.x;
    var yNew = yTarget * CD_SCROLL_FILTER_FACTOR + oldLayerPosition.y * (1 - CD_SCROLL_FILTER_FACTOR);

    this.rootNode.setPosition(xNew, yNew);
};
*/
