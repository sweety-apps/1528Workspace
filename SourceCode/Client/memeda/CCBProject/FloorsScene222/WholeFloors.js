//
// WholeFloors class
//

var gTestFloor = [
    {bg:"floor_blue",bottom:"floorBottom_blue",
        floorNum:"1F",specText:"",offsetY:0,
    doors:[
        {hasFinished:true,image:"door_black",doorNum:"001"},
        {hasFinished:false,image:"door_pink",doorNum:"002"},
        {hasFinished:true,image:"door_yellow",doorNum:"003"}
    ]},
    {bg:"floor_gray",bottom:"floorBottom_gray",
        floorNum:"2F",specText:"",offsetY:0,
        doors:[
            {hasFinished:true,image:"door_pink",doorNum:"011"},
            {hasFinished:false,image:"doorSpecial_1",doorNum:"012"},
            {hasFinished:false,image:"doorSpecial_3",doorNum:"013"}
        ]},
    {bg:"floor_pink",bottom:"floorBottom_pink",
        floorNum:"3F",specText:"SEX",offsetY:0,
        doors:[
            {hasFinished:true,image:"doorSpecial_2",doorNum:"021"},
            {hasFinished:true,image:"doorSpecial_4",doorNum:"022"},
            {hasFinished:true,image:"doorSpecial_5",doorNum:"023"}
        ]},
    {bg:"floor_yellow",bottom:"floorBottom_yellow",
        floorNum:"4F",specText:"",offsetY:0,
        doors:[
            {hasFinished:true,image:"doorSpecial_8",doorNum:"031"},
            {hasFinished:true,image:"doorSpecial_7",doorNum:"032"},
            {hasFinished:false,image:"doorSpecial_6",doorNum:"033"}
        ]}
];

function makeTestData()
{
    for(var i = 4; i < 40; i+=4)
    {
        var newFloors = [
            {bg:"floor_blue",bottom:"floorBottom_blue",
                floorNum:"1F",specText:"",offsetY:0,
                doors:[
                    {hasFinished:true,image:"door_black",doorNum:"001"},
                    {hasFinished:false,image:"door_pink",doorNum:"002"},
                    {hasFinished:true,image:"door_yellow",doorNum:"003"}
                ]},
            {bg:"floor_gray",bottom:"floorBottom_gray",
                floorNum:"2F",specText:"",offsetY:0,
                doors:[
                    {hasFinished:true,image:"door_pink",doorNum:"011"},
                    {hasFinished:false,image:"doorSpecial_1",doorNum:"012"},
                    {hasFinished:false,image:"doorSpecial_3",doorNum:"013"}
                ]},
            {bg:"floor_pink",bottom:"floorBottom_pink",
                floorNum:"3F",specText:"SEX",offsetY:0,
                doors:[
                    {hasFinished:true,image:"doorSpecial_2",doorNum:"021"},
                    {hasFinished:true,image:"doorSpecial_4",doorNum:"022"},
                    {hasFinished:true,image:"doorSpecial_5",doorNum:"023"}
                ]},
            {bg:"floor_yellow",bottom:"floorBottom_yellow",
                floorNum:"4F",specText:"",offsetY:0,
                doors:[
                    {hasFinished:true,image:"doorSpecial_8",doorNum:"031"},
                    {hasFinished:true,image:"doorSpecial_7",doorNum:"032"},
                    {hasFinished:false,image:"doorSpecial_6",doorNum:"033"}
                ]}
        ];

        newFloors[0].floorNum = ""+(i+0) +"F";
        newFloors[0].doors[0].doorNum = ""+(i+0)+""+1;
        newFloors[0].doors[1].doorNum = ""+(i+0)+""+2;
        newFloors[0].doors[2].doorNum = ""+(i+0)+""+3;

        newFloors[1].floorNum = ""+(i+1) +"F";
        newFloors[1].doors[0].doorNum = ""+(i+1)+""+1;
        newFloors[1].doors[1].doorNum = ""+(i+1)+""+2;
        newFloors[1].doors[2].doorNum = ""+(i+1)+""+3;

        newFloors[2].floorNum = ""+(i+2) +"F";
        newFloors[2].doors[0].doorNum = ""+(i+2)+""+1;
        newFloors[2].doors[1].doorNum = ""+(i+2)+""+2;
        newFloors[2].doors[2].doorNum = ""+(i+2)+""+3;

        newFloors[3].floorNum = ""+(i+3) +"F";
        newFloors[3].doors[0].doorNum = ""+(i+3)+""+1;
        newFloors[3].doors[1].doorNum = ""+(i+3)+""+2;
        newFloors[3].doors[2].doorNum = ""+(i+3)+""+3;

        gTestFloor[i+0]=newFloors[0];
        gTestFloor[i+1]=newFloors[1];
        gTestFloor[i+2]=newFloors[2];
        gTestFloor[i+3]=newFloors[3];
    }
}

var WholeFloors = function() {
};

WholeFloors.prototype.onDidLoadFromCCB = function () {

    // 设备上面需要开启触摸
    if( 'touches' in sys.capabilities )
        this.rootNode.setTouchEnabled(true);
        
    //var Floor0 = this.rawFloor0;
    //debugMsgOutput(Floor0.toString());
    //Floor0.controller.doorCover1.setVisible(false);

    makeTestData();
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
    this.buyMsgBox.setPositionY(height - 100);

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


WholeFloors.prototype.CalculateHeight = function ()
{
    return gTestFloor.length * this.floorHeight;
}