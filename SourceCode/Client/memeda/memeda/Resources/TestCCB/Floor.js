//
// Floor class
//

var Floor = function() {};

Floor.prototype.onDidLoadFromCCB = function () {
};

Floor.prototype.onClickedDoorCallback = function (floor,doorNum)
{
    debugMsgOutput("door "+ doorNum + " Clicked!");
};

Floor.prototype.onClickDoor1 = function () {
    this.onClickedDoorCallback(this,1);
};

Floor.prototype.onClickDoor2 = function () {
    this.onClickedDoorCallback(this,2);
};

Floor.prototype.onClickDoor3 = function () {
    this.onClickedDoorCallback(this,3);
};