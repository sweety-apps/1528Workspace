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
            if(paymentCallback.callBackMethod != null)
            {
                if(paymentCallback.callBackTarget != null)
                {
                    paymentCallback.callBackTarget.callBackMethodTmp = this.callBackMethod;
                    paymentCallback.callBackTarget.callBackMethodTmp(state,productID,errMsg);
                    paymentCallback.callBackTarget.callBackMethodTmp = null;
                }
                else
                {
                    paymentCallback.callBackMethod(state,productID,errMsg);
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
    return "com.1528studio.qietingfengyun.buy6special_package";
}

function Purchase_payForSpyPackage(callbackTarget,callbackMethod)
{
    Purchase_payForItem(Purchase_getSpyPackageProductID(),
        callbackTarget,
        callbackMethod);
}

function Purchase_payForCoinWith6RMB(callbackTarget,callbackMethod)
{
    Purchase_payForItem("com.1528studio.qietingfengyun.buy300coin",callbackTarget,callbackMethod);
}

function Purchase_payForCoinWith12RMB(callbackTarget,callbackMethod)
{
    Purchase_payForItem("com.1528studio.qietingfengyun.buy600coin",callbackTarget,callbackMethod);
}

function Purchase_payForCoinWith30RMB(callbackTarget,callbackMethod)
{
    Purchase_payForItem("com.1528studio.qietingfengyun.buy1500coin2",callbackTarget,callbackMethod);
}

function Purchase_payForCoinWith60RMB(callbackTarget,callbackMethod)
{
    Purchase_payForItem("com.1528studio.qietingfengyun.buy3000coin",callbackTarget,callbackMethod);
}
