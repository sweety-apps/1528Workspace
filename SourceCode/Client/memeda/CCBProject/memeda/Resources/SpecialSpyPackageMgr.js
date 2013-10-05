/**
 * Created with JetBrains WebStorm.
 * User: leejustin
 * Date: 13-10-5
 * Time: 下午12:15
 * To change this template use File | Settings | File Templates.
 */

//Keys
var kKeySpecialSpyPackageEnabled = "SpecialSpyPackage_Enabled";
var kKeySpecialSpyPackageLeftFloorsCount = "SpecialSpyPackage_LeftFloorsCount";

//标志位
var gSpecialSpyPackageMgr_Inited = false;
var gSpecialSpyPackageMgr_DebugClearData = false;

function SpecialSpyPackageMgr_Init()
{
    if(!gSpecialSpyPackageMgr_Inited)
    {
        var hasData = sys.localStorage.getItem(kKeySpecialSpyPackageEnabled);
        if(hasData == null || hasData == undefined)
        {
            sys.localStorage.setItem(kKeySpecialSpyPackageEnabled, false);
        }
        if(gSpecialSpyPackageMgr_DebugClearData)
        {
            sys.localStorage.setItem(kKeySpecialSpyPackageEnabled, false);
            sys.localStorage.setItem(kKeySpecialSpyPackageLeftFloorsCount, 0);
        }
        gSpecialSpyPackageMgr_Inited = true;
    }
}

function SpecialSpyPackageMgr_Uninit()
{
    gSpecialSpyPackageMgr_Inited = false;
}

function SpecialSpyPackageMgr_SetPurchased()
{
    SpecialSpyPackageMgr_Init();
    if(!SpecialSpyPackageMgr_IsPurchased())
    {
        sys.localStorage.setItem(kKeySpecialSpyPackageEnabled, true);
        sys.localStorage.setItem(kKeySpecialSpyPackageLeftFloorsCount, 100);
    }
}

function SpecialSpyPackageMgr_IsPurchased()
{
    SpecialSpyPackageMgr_Init();
    var enabled = sys.localStorage.getItem(kKeySpecialSpyPackageEnabled);
    if(enabled == "true")
    {
        enabled = true;
    }
    else
    {
        enabled = false;
    }
    return enabled;
}

function SpecialSpyPackageMgr_GetLeftFloorsCount()
{
    SpecialSpyPackageMgr_Init();
    if(SpecialSpyPackageMgr_IsPurchased())
    {
        var data = sys.localStorage.getItem(kKeySpecialSpyPackageLeftFloorsCount);
        data = parseInt(data);
        return data;
    }
    return 0;
}

function SpecialSpyPackageMgr_UseOneFloor()
{
    SpecialSpyPackageMgr_Init();
    if(SpecialSpyPackageMgr_IsPurchased())
    {
        var count = sys.localStorage.getItem(kKeySpecialSpyPackageLeftFloorsCount);
        count = parseInt(count);
        count -= 1;
        sys.localStorage.setItem(kKeySpecialSpyPackageLeftFloorsCount,count);
    }
}


