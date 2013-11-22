//
//  SocialShareAPI.cpp
//  memeda
//
//  Created by Lee Justin on 13-9-23.
//
//

#include "cocos2d.h"

#include "jsapi.h"
#include "jsfriendapi.h"
#include "cocos2d_specifics.hpp"
#include "SocialShareAPI.h"

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)

#include "SocialShareAPIForiOS.h"

#endif /*CC_TARGET_PLATFORM*/

#if SHARE_USE_PLUGIN_X

using namespace cocos2d::plugin;

#endif /*SHARE_USE_PLUGIN_X*/

void IOS_WeChatShareCallback(std::string state, std::string errorMsg, void* context);

#pragma mark - WeChatShareCallBackClass

void WeChatShareCallBackClass::onWechatShareCallback(std::string state, std::string errorMsg)
{
    
}

WeChatShareCallBackClass::~WeChatShareCallBackClass()
{
    
}

#pragma mark - PluginSocial Callback

#if SHARE_USE_PLUGIN_X
//namespace cocos2d {
class ShareResultListenerLocalImp : cocos2d::plugin::ShareResultListener
{
public:
    void* m_Context;
    
    ShareResultListenerLocalImp():m_Context(NULL){};
    virtual ~ShareResultListenerLocalImp(){};
    
    void onShareResult(ShareResultCode ret, const char* msg)
    {
        string state;
        string errorMsg = msg;
        switch (ret) {
            case kShareSuccess:
                state = "Success";
                break;
            case kShareFail:
                state = "Fail";
                break;
            case kShareCancel:
                state = "Cancel";
                break;
            case kShareTimeOut:
                state = "Fail";
                break;
                
            default:
                break;
        }
        
         cocos2d::CCLog("onShareResult With state = %s, msg = %s",state.c_str(),msg);
        
        IOS_WeChatShareCallback(state, errorMsg, m_Context);
    };
};
//};
#endif

#pragma mark - SocialShareAPI

SocialShareAPI::SocialShareAPI()
{
    wechatShareCallbackTarget = NULL;
#if SHARE_USE_PLUGIN_X
    m_sharePlugin = NULL;
    m_resultListener = NULL;
#endif /*SHARE_USE_PLUGIN_X*/
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
#endif /*CC_TARGET_PLATFORM*/
    
#if SHARE_USE_PLUGIN_X
    if (NULL == m_sharePlugin)
	{
        m_sharePlugin = dynamic_cast<ProtocolSocial*>(PluginManager::getInstance()->loadPlugin("ShareSDKPluginX"));
        ShareResultListenerLocalImp* listener = new ShareResultListenerLocalImp();
        listener->m_Context = this;
        m_resultListener = (ShareResultListener*)listener;
        m_sharePlugin->setResultListener(m_resultListener);
	}
#endif /*SHARE_USE_PLUGIN_X*/
}

void SocialShareAPI::uninitShareAPI()
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    SocialShareAPIForiOS_uninitShareAPI();
#endif /*CC_TARGET_PLATFORM*/
    
#if SHARE_USE_PLUGIN_X
    if (NULL != m_sharePlugin)
	{
		PluginManager::getInstance()->unloadPlugin("ShareSDKPluginX");
		m_sharePlugin = NULL;
        ShareResultListenerLocalImp* listener = (ShareResultListenerLocalImp*)m_resultListener;
        delete listener;
        m_resultListener = NULL;
	}
#endif

}

void SocialShareAPI::testShare()
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    SocialShareAPIForiOS_doTestShare();
#endif /*CC_TARGET_PLATFORM*/
    
#if SHARE_USE_PLUGIN_X
    if (NULL != m_sharePlugin) {
	    TShareInfo pInfo;
	    pInfo["text"] = "cocos2d-x share sdk plugin-x test";
	    m_sharePlugin->share(pInfo);
	}
#endif /*SHARE_USE_PLUGIN_X*/
    
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
#endif /*CC_TARGET_PLATFORM*/
    
#if SHARE_USE_PLUGIN_X
#endif /*SHARE_USE_PLUGIN_X*/
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
#endif /*CC_TARGET_PLATFORM*/
    
#if SHARE_USE_PLUGIN_X
    TShareInfo pInfo;
    pInfo["isTimeline"] = isTimeline ? "true" : "false";
    pInfo["title"] = title.c_str();
    pInfo["imagePath"] = imgPath.c_str();
    pInfo["url"] = url.c_str();
    pInfo["text"] = content.c_str();
    pInfo["extInfo"] = description.c_str();
    m_sharePlugin->share(pInfo);
#endif /*SHARE_USE_PLUGIN_X*/
}

signed char SocialShareAPI::iOS_application_handleOpenURL(void* application, void* url, void* wxDelegate)
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    return SocialShareAPIForiOS_application_handleOpenURL(application, url, wxDelegate);
#endif /*CC_TARGET_PLATFORM*/
    
#if SHARE_USE_PLUGIN_X
    return 0;
#endif /*SHARE_USE_PLUGIN_X*/
}

signed char SocialShareAPI::iOS_application_openURL_sourceApplication_annotation(void* application, void* url, void* sourceApplication, void* annotation, void* wxDelegate)
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    return SocialShareAPIForiOS_application_openURL_sourceApplication_annotation(application, url, sourceApplication, annotation, wxDelegate);
#endif /*CC_TARGET_PLATFORM*/
    
#if SHARE_USE_PLUGIN_X
    return 0;
#endif /*SHARE_USE_PLUGIN_X*/
}