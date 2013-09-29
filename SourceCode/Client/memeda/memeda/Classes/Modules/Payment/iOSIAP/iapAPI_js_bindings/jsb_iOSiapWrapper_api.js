/**
 * @module jsb_iOSiapWrapper
 */
var cc = cc || {};

/**
 * @class iOSiapWrapperCallBackClass
 */
cc.iOSiapWrapperCallBackClass = {

/**
 * @method onPurchaseCallback
 * @param {std::string}
 * @param {std::string}
 * @param {std::string}
 */
onPurchaseCallback : function () {},

/**
 * @method iOSiapWrapperCallBackClass
 * @constructor
 */
iOSiapWrapperCallBackClass : function () {},

};

/**
 * @class iOSiapWrapper
 */
cc.iOSiapWrapper = {

/**
 * @method payForProduct
 * @param {std::string}
 */
payForProduct : function () {},

/**
 * @method getPurchaseCallbackTarget
 * @return A value converted from C/C++ "iOSiapWrapperCallBackClass*"
 */
getPurchaseCallbackTarget : function () {},

/**
 * @method setPurchaseCallbackTarget
 * @param {iOSiapWrapperCallBackClass*}
 */
setPurchaseCallbackTarget : function () {},

/**
 * @method getInstance
 * @return A value converted from C/C++ "iOSiapWrapper*"
 */
getInstance : function () {},

/**
 * @method iOSiapWrapper
 * @constructor
 */
iOSiapWrapper : function () {},

};
