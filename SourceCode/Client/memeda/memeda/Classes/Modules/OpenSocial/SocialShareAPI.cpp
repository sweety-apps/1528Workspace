//
//  SocialShareAPI.cpp
//  memeda
//
//  Created by Lee Justin on 13-9-23.
//
//

#include "cocos2d.h"
#include "SocialShareAPI.h"

#include "jsapi.h"
#include "jsfriendapi.h"
#include "cocos2d_specifics.hpp"

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)

#include "SocialShareAPIForiOS.h"

#elif (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)

#endif /*CC_TARGET_PLATFORM*/

#pragma mark - WeChatShareCallBackClass

void WeChatShareCallBackClass::onWechatShareCallback(std::string state, std::string errorMsg)
{
    
}

WeChatShareCallBackClass::~WeChatShareCallBackClass()
{
    
}

#pragma mark - SocialShareAPI

SocialShareAPI::SocialShareAPI()
{
    wechatShareCallbackTarget = NULL;
}

SocialShareAPI::~SocialShareAPI()
{
}

SocialShareAPI* SocialShareAPI::g_singleInstance = NULL;

SocialShareAPI* SocialShareAPI::getInstance()
{
    if (g_singleInstance == NULL)
    {
        g_singleInstance = new SocialShareAPI();
    }
    return g_singleInstance;
}

void SocialShareAPI::initShareAPI()
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    SocialShareAPIForiOS_initShareAPI();
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    
#endif /*CC_TARGET_PLATFORM*/
}

void SocialShareAPI::uninitShareAPI()
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    SocialShareAPIForiOS_uninitShareAPI();
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    
#endif /*CC_TARGET_PLATFORM*/
}

void SocialShareAPI::testShare()
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    SocialShareAPIForiOS_doTestShare();
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    
#endif /*CC_TARGET_PLATFORM*/
    
}

void IOS_WeChatShareCallback(std::string state, std::string errorMsg, void* context)
{
    SocialShareAPI* api = (SocialShareAPI*)context;
    
    if (api->wechatShareCallbackTarget != NULL)
    {
        //做JS的回调
        js_proxy_t* p = jsb_get_native_proxy(api->wechatShareCallbackTarget);
        if (p != NULL)
        {
            JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
            jsval retval;
            jsval v[] = {
                v[0] = std_string_to_jsval(cx, state),
                v[1] = std_string_to_jsval(cx, errorMsg)
            };
            ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(p->obj),
                                                                   "onWechatShareCallback", sizeof(v)/sizeof(v[0]), v, &retval);
        }
        api->wechatShareCallbackTarget->onWechatShareCallback(state, errorMsg);
    }
}

void SocialShareAPI::setShareButtonRectAtScreenForIPad(int x,int y,int width, int height)
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    SocialShareAPIForiOS_setShareButtonRectAtScreenForIPad(x, y, width, height);
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#endif /*CC_TARGET_PLATFORM*/
}

void SocialShareAPI::shareWeChatURL(std::string content, std::string imageName,std::string title, std::string url, std::string description ,bool withMenuUI, bool isTimeline)
{
    if (imageName.length() <= 0)
    {
        imageName = "Icon-72.png";
    }
    
    std::string imgPath = cocos2d::CCFileUtils::sharedFileUtils()->fullPathForFilename(imageName.c_str());
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    SocialShareAPIForiOS_shareWeChatURL(content, imgPath, title, url, description,  (void*)IOS_WeChatShareCallback, (void*)this,withMenuUI,isTimeline);
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#endif /*CC_TARGET_PLATFORM*/
}

signed char SocialShareAPI::iOS_application_handleOpenURL(void* application, void* url, void* wxDelegate)
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    return SocialShareAPIForiOS_application_handleOpenURL(application, url, wxDelegate);
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    return 0;
#endif /*CC_TARGET_PLATFORM*/
}

signed char SocialShareAPI::iOS_application_openURL_sourceApplication_annotation(void* application, void* url, void* sourceApplication, void* annotation, void* wxDelegate)
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    return SocialShareAPIForiOS_application_openURL_sourceApplication_annotation(application, url, sourceApplication, annotation, wxDelegate);
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    return 0;
#endif /*CC_TARGET_PLATFORM*/
}