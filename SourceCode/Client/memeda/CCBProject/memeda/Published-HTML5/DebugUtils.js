var kDEBUGEnableAlertBox = false;//true;//

function debugMsgOutput(msg)
{
    cc.log(msg);

    if(kDEBUGEnableAlertBox)
    {
        if(alert == undefined || alert == null)
        {
        }
        else
        {
            alert(msg);
        }
    }
}