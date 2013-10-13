/**
 * Created with JetBrains WebStorm.
 * User: leejustin
 * Date: 13-10-13
 * Time: 下午7:54
 * To change this template use File | Settings | File Templates.
 */

var gTestFloorUIConfig = [
    {bg:"floor_pink",bottom:"floorBottom_pink",
        floorNum:"1F",specText:"",offsetY:0,
        doors:[
            {hasFinished:true,image:"door_pink",doorNum:"001"},
            {hasFinished:true,image:"door_pink",doorNum:"002"},
            {hasFinished:true,image:"door_pink",doorNum:"003"}
        ]},
    {bg:"floor_pink",bottom:"floorBottom_pink",
        floorNum:"2F",specText:"SEX",offsetY:0,
        doors:[
            {hasFinished:true,image:"door_blue",doorNum:"011"},
            {hasFinished:false,image:"door_blue",doorNum:"012"},
            {hasFinished:false,image:"door_blue",doorNum:"013"}
        ]},
    {bg:"floor_blue",bottom:"floorBottom_blue",
        floorNum:"3F",specText:"",offsetY:0,
        doors:[
            {hasFinished:true,image:"door_yellow",doorNum:"021"},
            {hasFinished:true,image:"door_yellow",doorNum:"022"},
            {hasFinished:true,image:"door_yellow",doorNum:"023"}
        ]},
    {bg:"floor_pink",bottom:"floorBottom_pink",
        floorNum:"4F",specText:"",offsetY:0,
        doors:[
            {hasFinished:true,image:"door_gray",doorNum:"031"},
            {hasFinished:true,image:"door_gray",doorNum:"032"},
            {hasFinished:false,image:"door_gray",doorNum:"033"}
        ]}
];

var gTestFloor = [
    {bg:"floor_blue",bottom:"floorBottom_blue",
        floorNum:"1F",specText:"",offsetY:0,
        doors:[
            {hasFinished:true,image:"door_black",doorNum:"001"},
            {hasFinished:true,image:"door_pink",doorNum:"002"},
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

function FloorsData_resetTestData_Web()
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

function FloorsData_resetTestData_Device()
{
    var pbl_count = Problem_GetCount();
    var flr_count = Math.ceil(pbl_count/3);

    //var flr_color = ["",];
    for(var f = 0; f < flr_count; ++f)
    {
        var floorData = new {bg:"floor_blue",bottom:"floorBottom_blue",
            floorNum:"1F",specText:"",offsetY:0,
            doors:[
                {hasFinished:true,image:"door_black",doorNum:"001"},
                {hasFinished:false,image:"door_pink",doorNum:"002"},
                {hasFinished:true,image:"door_yellow",doorNum:"003"}
            ]};


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
        FloorsData_resetTestData_Web();//FloorsData_resetTestData_Device();
    }
}
