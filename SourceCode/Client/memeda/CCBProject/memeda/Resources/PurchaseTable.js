/**
 * Created with JetBrains WebStorm.
 * User: leejustin
 * Date: 13-10-1
 * Time: 下午4:10
 * To change this template use File | Settings | File Templates.
 */

function Purchase_payForItem(itemID,callbackTarget,callbackMethod)
{
    if(!Global_isWeb())
    {
        var paymentCallback = new cc.iOSiapWrapperCallBackClass();
        paymentCallback.callBackTarget = null;
        paymentCallback.callBackMethod = null;
        if(callbackMethod != null && callbackMethod != undefined)
        {
            paymentCallback.callBackMethod = callbackMethod;
            if(callbackTarget != null && callbackTarget != undefined)
            {
                paymentCallback.callBackTarget = callbackTarget;
            }
        }

        paymentCallback.onPurchaseCallback = function (state, productID, errMsg) {
            cc.log("payment callback!");
            cc.log("state = " + state + ", productID = " + productID +", errMsg = " + errMsg);
            if(this.callBackMethod != null)
            {
                if(this.callBackTarget != null)
                {
                    this.callBackTarget.callBackMethodTmp = this.callBackMethod;
                    this.callBackTarget.callBackMethodTmp.callBackMethod(state,productID,errMsg);
                    this.callBackTarget.callBackMethodTmp = null;
                }
                else
                {
                    this.callBackMethod(state,productID,errMsg);
                }
            }
        };

        var iOSiapAPI = cc.iOSiapWrapper.getInstance();
        iOSiapAPI.setPurchaseCallbackTarget(paymentCallback);
        iOSiapAPI.payForProduct(itemID);
        //cc.SocialShareAPI.sharedInstance().testShare();
    }
}

function Purchase_getSpyPackageProductID()
{
    return "SpecialSpyPackage6";
}

function Purchase_payForSpyPackage(callbackTarget,callbackMethod)
{
    Purchase_payForItem(Purchase_getSpyPackageProductID(),
        callbackTarget,
        callbackMethod);
}

function Purchase_payForCoinWith6RMB(callbackTarget,callbackMethod)
{
    Purchase_payForItem("com.1528studio.memeda.buy300coin",callbackTarget,callbackMethod);
}

function Purchase_payForCoinWith12RMB(callbackTarget,callbackMethod)
{
    Purchase_payForItem("com.1528studio.memeda.buy600coin",callbackTarget,callbackMethod);
}

function Purchase_payForCoinWith30RMB(callbackTarget,callbackMethod)
{
    Purchase_payForItem("com.1528studio.memeda.buy1500coin",callbackTarget,callbackMethod);
}

function Purchase_payForCoinWith60RMB(callbackTarget,callbackMethod)
{
    Purchase_payForItem("com.1528studio.memeda.buy3000coin",callbackTarget,callbackMethod);
}
