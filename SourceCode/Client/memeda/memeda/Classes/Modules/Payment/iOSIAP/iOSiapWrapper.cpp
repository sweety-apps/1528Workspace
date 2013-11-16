//
//  iOSiapWrapper.cpp
//  memeda
//
//  Created by Lee Justin on 13-9-29.
//
//

#include "cocos2d.h"
#include "jsapi.h"
#include "jsfriendapi.h"
#include "cocos2d_specifics.hpp"

#include "iOSiapWrapper.h"

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
#include "iOSiapImp.h"
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#include "PluginManager.h"
#include "ProtocolIAP.h"
#endif /*CC_TARGET_PLATFORM*/

#pragma mark - iOSiapWrapperCallBackClass

void iOSiapWrapperCallBackClass::onPurchaseCallback(std::string result, std::string productID, std::string errorMsg)
{
    
}

#pragma mark - iOSiapWrapper

static void iOS_Purchase_Callback(std::string result, std::string productID, std::string errorMsg, void* context)
{
    iOSiapWrapper* wrapper = (iOSiapWrapper*)context;
    if (wrapper->purchaseCallbackTarget != NULL)
    {
        //做JS的回调
        js_proxy_t* p = jsb_get_native_proxy(wrapper->purchaseCallbackTarget);
        if (p != NULL)
        {
            JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
            jsval retval;
            jsval v[] = {
                v[0] = std_string_to_jsval(cx, result),
                v[1] = std_string_to_jsval(cx, productID),
                v[1] = std_string_to_jsval(cx, errorMsg)
            };
            ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(p->obj),
                                                                   "onPurchaseCallback", sizeof(v)/sizeof(v[0]), v, &retval);
        }
        wrapper->purchaseCallbackTarget->onPurchaseCallback(result, productID, errorMsg);
    }
}

iOSiapWrapper* iOSiapWrapper::g_singleInstance = NULL;
cocos2d::plugin::ProtocolIAP* iOSiapWrapper::g_aliPay = NULL;

iOSiapWrapper* iOSiapWrapper::getInstance()
{
    if (g_singleInstance == NULL)
    {
        g_singleInstance = new iOSiapWrapper();
    }
    return g_singleInstance;
}

iOSiapWrapper::iOSiapWrapper()
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    handle = iOSiap_create();
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    cocos2d::CCLog("iOSiapWrapper::js_init");
    cocos2d::plugin::PluginProtocol* plugin = cocos2d::plugin::PluginManager::getInstance()->loadPlugin("IAPAlipay");
    
    g_aliPay = (cocos2d::plugin::ProtocolIAP*)plugin;
#endif /*CC_TARGET_PLATFORM*/
}

iOSiapWrapper::~iOSiapWrapper()
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    iOSiap_destory(handle);
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#endif /*CC_TARGET_PLATFORM*/
}

void iOSiapWrapper::payForProduct(std::string productID)
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    iOSiap_payforPuduct(handle, productID, iOS_Purchase_Callback, this);
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    cocos2d::plugin::TProductInfo info;
    info["product"] = productID;
    g_aliPay->payForProduct(info);
#endif /*CC_TARGET_PLATFORM*/
}

void iOSiapWrapper::initAll()
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    iOSiap_init();
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#endif /*CC_TARGET_PLATFORM*/
}
