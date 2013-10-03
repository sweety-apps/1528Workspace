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
        iOSiapAPI.payForProduct("SpecialSpyPackage6");
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
        iOSiapAPI.payForProduct("SpecialSpyPackage6");
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
        iOSiapAPI.payForProduct("SpecialSpyPackage6");
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
        iOSiapAPI.payForProduct("SpecialSpyPackage6");
        //cc.SocialShareAPI.sharedInstance().testShare();
    }
}
