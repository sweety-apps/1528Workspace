//
//  SocialShareAPI.h
//  memeda
//
//  Created by Lee Justin on 13-9-23.
//
//

#ifndef __memeda__SocialShareAPI__
#define __memeda__SocialShareAPI__

#include <iostream>

class WeChatShareCallBackClass
{
public:
    WeChatShareCallBackClass(){};
    virtual ~WeChatShareCallBackClass();
    virtual void onWechatShareCallback(std::string state, std::string errorMsg);
};

class SocialShareAPI
{
protected:
    static SocialShareAPI* g_singleInstance;
    WeChatShareCallBackClass* wechatShareCallbackTarget;
    friend void IOS_WeChatShareCallback(std::string state, std::string errorMsg, void* context);
public:
    SocialShareAPI();
    virtual ~SocialShareAPI();
    
    void setWeChatShareCallbackTarget(WeChatShareCallBackClass* target)
    {
        wechatShareCallbackTarget = target;
    }
    WeChatShareCallBackClass*  getWeChatShareCallbackTarget(){
        return wechatShareCallbackTarget;
    };
    
    static SocialShareAPI* getInstance();
    void initShareAPI();
    void uninitShareAPI();
    void testShare();
    
    signed char iOS_application_handleOpenURL(void* application, void* url, void* wxDelegate);
    signed char iOS_application_openURL_sourceApplication_annotation(void* application, void* url, void* sourceApplication, void* annotation, void* wxDelegate);
    
    void shareWeChatURL(std::string content, std::string imageName,std::string title, std::string url, std::string description ,bool isTimeline);
};

#endif /* defined(__memeda__SocialShareAPI__) */
