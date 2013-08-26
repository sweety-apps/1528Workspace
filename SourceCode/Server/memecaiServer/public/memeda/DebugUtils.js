var kDEBUGEnableAlertBox = false;

function debugMsgOutput(msg)
{
    cc.log(msg);

    if(kDEBUGEnableAlertBox)
    {
        if(alert === undefined)
        {
        }
        else
        {
            alert(msg);
        }
    }
}