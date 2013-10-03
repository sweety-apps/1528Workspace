var BGLayer = function() {};

BGLayer.prototype.onDidLoadFromCCB = function () {
};

BGLayer.prototype.setBkg = function(bg, door) {
	this.bgCtrlLayer.controller.setBkg(bg);
	this.bgDoorLayer.controller.setBkg(door);
};
