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
    
    //如果是iPad，使用了默认UI，会在按钮附近产生一个popoverView来分享,位置需要设置。
    void setShareButtonRectAtScreenForIPad(int x,int y,int width, int height);
    
    // 如果设置了 withMenuUI 则展示分享栏的UI，isTimeline选项无用
    // isTimeline true时分享到朋友圈，false时分享到对话
    void shareWeChatURL(std::string content, std::string imageName,std::string title, std::string url, std::string description ,bool withMenuUI, bool isTimeline);
};

#endif /* defined(__memeda__SocialShareAPI__) */
