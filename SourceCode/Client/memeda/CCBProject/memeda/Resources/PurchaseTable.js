/**
 * Created with JetBrains WebStorm.
 * User: leejustin
 * Date: 13-10-1
 * Time: 下午4:10
 * To change this template use File | Settings | File Templates.
 */

function Purchase_payForSpyPackage()
{
    if(!Global_isWeb())
    {
        var paymentCallback = new cc.iOSiapWrapperCallBackClass();
        paymentCallback.onPurchaseCallback = function (state, productID, errMsg) {
            cc.log("payment callback!");
            cc.log("state = " + state + ", productID = " + productID +", errMsg = " + errMsg);
        };

        var iOSiapAPI = cc.iOSiapWrapper.getInstance();
        iOSiapAPI.setPurchaseCallbackTarget(paymentCallback);
        iOSiapAPI.payForProduct("SpecialSpyPackage6");
        //cc.SocialShareAPI.sharedInstance().testShare();
    }
}

function Purchase_payForCoinWith6RMB()
{
    if(!Global_isWeb())
    {
        var paymentCallback = new cc.iOSiapWrapperCallBackClass();
        paymentCallback.onPurchaseCallback = function (state, productID, errMsg) {
            cc.log("payment callback!");
            cc.log("state = " + state + ", productID = " + productID +", errMsg = " + errMsg);
        };

        var iOSiapAPI = cc.iOSiapWrapper.getInstance();
        iOSiapAPI.setPurchaseCallbackTarget(paymentCallback);
        iOSiapAPI.payForProduct("com.1528studio.memeda.buy300coin");
        //cc.SocialShareAPI.sharedInstance().testShare();
    }
}

function Purchase_payForCoinWith12RMB()
{
    if(!Global_isWeb())
    {
        var paymentCallback = new cc.iOSiapWrapperCallBackClass();
        paymentCallback.onPurchaseCallback = function (state, productID, errMsg) {
            cc.log("payment callback!");
            cc.log("state = " + state + ", productID = " + productID +", errMsg = " + errMsg);
        };

        var iOSiapAPI = cc.iOSiapWrapper.getInstance();
        iOSiapAPI.setPurchaseCallbackTarget(paymentCallback);
        iOSiapAPI.payForProduct("com.1528studio.memeda.buy600coin");
        //cc.SocialShareAPI.sharedInstance().testShare();
    }
}

function Purchase_payForCoinWith30RMB()
{
    if(!Global_isWeb())
    {
        var paymentCallback = new cc.iOSiapWrapperCallBackClass();
        paymentCallback.onPurchaseCallback = function (state, productID, errMsg) {
            cc.log("payment callback!");
            cc.log("state = " + state + ", productID = " + productID +", errMsg = " + errMsg);
        };

        var iOSiapAPI = cc.iOSiapWrapper.getInstance();
        iOSiapAPI.setPurchaseCallbackTarget(paymentCallback);
        iOSiapAPI.payForProduct("com.1528studio.memeda.buy1500coin");
        //cc.SocialShareAPI.sharedInstance().testShare();
    }
}

function Purchase_payForCoinWith60RMB()
{
    if(!Global_isWeb())
    {
        var paymentCallback = new cc.iOSiapWrapperCallBackClass();
        paymentCallback.onPurchaseCallback = function (state, productID, errMsg) {
            cc.log("payment callback!");
            cc.log("state = " + state + ", productID = " + productID +", errMsg = " + errMsg);
        };

        var iOSiapAPI = cc.iOSiapWrapper.getInstance();
        iOSiapAPI.setPurchaseCallbackTarget(paymentCallback);
        iOSiapAPI.payForProduct("com.1528studio.memeda.buy3000coin");
        //cc.SocialShareAPI.sharedInstance().testShare();
    }
}
