//
//  SocialShareAPIForiOS.h
//  memeda
//
//  Created by Lee Justin on 13-9-23.
//
//

#ifndef __SocialShareAPIForiOS__H__
#define __SocialShareAPIForiOS__H__

#include <iostream>

#define kSocialShareStateBegan "Began"
#define kSocialShareStateSuccess "Success"
#define kSocialShareStateFail "Fail"
#define kSocialShareStateCancel "Cancel"

typedef void (*WeChatShareCallback)(std::string state, std::string errorMsg, void* context);

void SocialShareAPIForiOS_initShareAPI();
void SocialShareAPIForiOS_uninitShareAPI();
void SocialShareAPIForiOS_doTestShare();
//如果是iPad，使用了默认UI，会在按钮附近产生一个popoverView来分享,位置需要设置。
void SocialShareAPIForiOS_setShareButtonRectAtScreenForIPad(int x,int y,int width, int height);
// callbackFunction 定义为 void WeChatShareCallback
// 如果设置了 withMenuUI 则展示分享栏的UI，isTimeline选项无用
// isTimeline true时分享到朋友圈，false时分享到对话
void SocialShareAPIForiOS_shareWeChatURL(std::string content, std::string imagePath,std::string title, std::string url, std::string description,void* callbackFunction,void* callbackFunctionContext, bool withMenuUI, bool isTimeline);

signed char SocialShareAPIForiOS_application_handleOpenURL(void* application, void* url, void* wxDelegate);
signed char SocialShareAPIForiOS_application_openURL_sourceApplication_annotation(void* application, void* url, void* sourceApplication, void* annotation, void* wxDelegate);

#endif /*__SocialShareAPIForiOS__H__*/