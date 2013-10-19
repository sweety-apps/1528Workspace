/**
 * Created with JetBrains WebStorm.
 * User: leejustin
 * Date: 13-10-13
 * Time: 下午7:54
 * To change this template use File | Settings | File Templates.
 */

var kDoorStateOpen = "open";
var kDoorStateLocked = "locked";
var kDoorStateJumped = "jumped";
var kDoorStateFinished = "finished";
var kDoorStateHide = "hide";

var gTestFloor = [
    {bg:"floor_blue",bottom:"floorBottom_blue",
        floorNum:"1F",specText:"",offsetY:0,
        doors:[
            {hasFinished:true,image:"door_black",doorNum:"001",doorState:kDoorStateLocked},
            {hasFinished:true,image:"door_pink",doorNum:"002",doorState:kDoorStateLocked},
            {hasFinished:true,image:"door_yellow",doorNum:"003",doorState:kDoorStateLocked}
        ]},
    {bg:"floor_gray",bottom:"floorBottom_gray",
        floorNum:"2F",specText:"",offsetY:0,
        doors:[
            {hasFinished:true,image:"door_pink",doorNum:"011",doorState:kDoorStateLocked},
            {hasFinished:false,image:"doorSpecial_1",doorNum:"012",doorState:kDoorStateLocked},
            {hasFinished:false,image:"doorSpecial_3",doorNum:"013",doorState:kDoorStateHide}
        ]},
    {bg:"floor_pink",bottom:"floorBottom_pink",
        floorNum:"3F",specText:"SEX",offsetY:0,
        doors:[
            {hasFinished:true,image:"doorSpecial_2",doorNum:"021",doorState:kDoorStateLocked},
            {hasFinished:true,image:"doorSpecial_4",doorNum:"022",doorState:kDoorStateOpen},
            {hasFinished:true,image:"doorSpecial_5",doorNum:"023",doorState:kDoorStateOpen}
        ]},
    {bg:"floor_yellow",bottom:"floorBottom_yellow",
        floorNum:"4F",specText:"",offsetY:0,
        doors:[
            {hasFinished:true,image:"doorSpecial_8",doorNum:"031",doorState:kDoorStateLocked},
            {hasFinished:true,image:"doorSpecial_7",doorNum:"032",doorState:kDoorStateLocked},
            {hasFinished:false,image:"doorSpecial_6",doorNum:"033",doorState:kDoorStateLocked}
        ]}
];

function FloorsData_resetTestData_Web()
{
    for(var i = 4; i < 40; i+=4)
    {
        var newFloors = [
            {bg:"floor_blue",bottom:"floorBottom_blue",
                floorNum:"1F",specText:"",offsetY:0,
                doors:[
                    {hasFinished:true,image:"door_black",doorNum:"001",doorState:kDoorStateLocked},
                    {hasFinished:false,image:"door_pink",doorNum:"002",doorState:kDoorStateLocked},
                    {hasFinished:true,image:"door_yellow",doorNum:"003",doorState:kDoorStateJumped}
                ]},
            {bg:"floor_gray",bottom:"floorBottom_gray",
                floorNum:"2F",specText:"",offsetY:0,
                doors:[
                    {hasFinished:true,image:"door_pink",doorNum:"011",doorState:kDoorStateFinished},
                    {hasFinished:false,image:"doorSpecial_1",doorNum:"012",doorState:kDoorStateFinished},
                    {hasFinished:false,image:"doorSpecial_3",doorNum:"013",doorState:kDoorStateJumped}
                ]},
            {bg:"floor_pink",bottom:"floorBottom_pink",
                floorNum:"3F",specText:"SEX",offsetY:0,
                doors:[
                    {hasFinished:true,image:"doorSpecial_2",doorNum:"021",doorState:kDoorStateOpen},
                    {hasFinished:true,image:"doorSpecial_4",doorNum:"022",doorState:kDoorStateOpen},
                    {hasFinished:true,image:"doorSpecial_5",doorNum:"023",doorState:kDoorStateFinished}
                ]},
            {bg:"floor_yellow",bottom:"floorBottom_yellow",
                floorNum:"4F",specText:"",offsetY:0,
                doors:[
                    {hasFinished:true,image:"doorSpecial_8",doorNum:"031",doorState:kDoorStateOpen},
                    {hasFinished:true,image:"doorSpecial_7",doorNum:"032",doorState:kDoorStateHide},
                    {hasFinished:false,image:"doorSpecial_6",doorNum:"033",doorState:kDoorStateHide}
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

function FloorsData_resetTestData_Device()
{
    var pbl_count = Problem_GetCount();
    var flr_count = Math.ceil(pbl_count/3);

    var flr_color_loop = ["yellow","pink","blue"];
    var door_color_loop = ["pink","blue","yellow","black"];

    for(var f = 0; f < flr_count; ++f)
    {
        var floorData = {bg:"floor_blue",bottom:"floorBottom_blue",
            floorNum:"1F",specText:"",offsetY:0,
            doors:[
                {hasFinished:true,image:"door_black",doorNum:"001",doorState:kDoorStateHide},
                {hasFinished:false,image:"door_pink",doorNum:"002",doorState:kDoorStateHide},
                {hasFinished:true,image:"door_yellow",doorNum:"003",doorState:kDoorStateHide}
            ]};

        var flr_idx = f%(flr_color_loop.length);
        var door_idx = f%(door_color_loop.length);

        floorData.bg = "floor_"+flr_color_loop[flr_idx];
        floorData.bottom = "floorBottom_"+flr_color_loop[flr_idx];
        floorData.floorNum = ""+(f+1)+"F";

        for(var d = 0; d < floorData.doors.length; ++d)
        {
            var testNum = (f*3)+d;
            var doorNumStr = "";
            if(testNum > 98)
            {
                doorNumStr = ""+(testNum+1);
            }
            else if(testNum > 8)
            {
                doorNumStr = "0"+(testNum+1);
            }
            else
            {
                doorNumStr = "00"+(testNum+1);
            }

            floorData.doors[d].hasFinished = false;
            floorData.doors[d].image = "door_"+door_color_loop[door_idx];
            floorData.doors[d].doorNum = doorNumStr;
        }

        gTestFloor[f] = floorData;
    }

    var lastAnsweredTest = 0;
    for(var t = 0; t < pbl_count ; ++t)
    {
        var testInfo = Problem_GetBaseInfo(t);
        if(Problem_isAnswerRight(testInfo.id) || Problem_isJump(testInfo.id))
        {
            lastAnsweredTest = t + 1;
        }
    }

    for(var f = 0; f < flr_count; ++f)
    {
        var floorData = gTestFloor[f];

        for(var d = 0; d < floorData.doors.length; ++d)
        {
            var testNum = (f*3)+d;
            var testInfo = Problem_GetBaseInfo(testNum);
            var lastTestInfo = null;
            if(testNum > 0)
            {
                lastTestInfo = Problem_GetBaseInfo(testNum - 1);
            }

            if(testInfo != null)
            {
                if(Problem_isAnswerRight(testInfo.id))
                {
                    floorData.doors[d].hasFinished = true;
                    floorData.doors[d].doorState = kDoorStateFinished;
                }
                else if(Problem_isJump(testInfo.id))
                {
                    floorData.doors[d].hasFinished = true;
                    floorData.doors[d].doorState = kDoorStateJumped;
                }
                else
                {
                    floorData.doors[d].hasFinished = false;
                    floorData.doors[d].doorState = kDoorStateLocked;
                }
            }

            if(testNum == lastAnsweredTest)
            {
                floorData.doors[d].hasFinished = true;
                floorData.doors[d].doorState = kDoorStateOpen;
            }
        }

        gTestFloor[f] = floorData;
    }
}

function FloorsData_resetTestData()
{
    if(Global_isWeb())
    {
        FloorsData_resetTestData_Web();
    }
    else
    {
        FloorsData_resetTestData_Device();
    }
}
