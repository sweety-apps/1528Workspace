var CCSpriteButton = function() {};

CCSpriteButton.prototype.onDidLoadFromCCB = function () {

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
};

///// Logic Methods
// Create callback for button
CCSpriteButton.prototype.onPressButton = function()
{	
    // Rotate the label when the button is pressed
    //this.helloLabel.runAction(cc.RotateBy.create(1,360));
    cc.AudioEngine.getInstance().stopMusic();
    cc.AudioEngine.getInstance().playMusic("sounds/MIAO1.mp3",true);
};

///// Events Handlers
// Touches
CCSpriteButton.prototype.onTouchesBegan = function (touches, event)
{
	//TODO:
};

CCSpriteButton.prototype.onTouchesMoved = function (touches, event)
{
	//TODO:
};

CCSpriteButton.prototype.onTouchesEnded = function (touches, event)
{
	this.onPressButton();
};

CCSpriteButton.prototype.onTouchesCancelled = function (touches, event)
{
	//TODO:
};
// Mouse
CCSpriteButton.prototype.onMouseDown = function ( event )
{
	//TODO:
};

CCSpriteButton.prototype.onMouseDragged = function ( event )
{
	//TODO:
};

CCSpriteButton.prototype.onMouseMoved = function ( event )
{
	//TODO:
};

CCSpriteButton.prototype.onMouseUp = function ( event )
{
	this.onPressButton();
};

// Accelerometer
CCSpriteButton.prototype.onAccelerometer = function( event) 
{
    //TODO:
};