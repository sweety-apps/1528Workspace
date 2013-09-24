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
// callbackFunction 定义为 void WeChatShareCallback
void SocialShareAPIForiOS_shareWeChatURL(std::string content, std::string imagePath,std::string title, std::string url, std::string description ,bool isTimeline,void* callbackFunction,void* callbackFunctionContext);

signed char SocialShareAPIForiOS_application_handleOpenURL(void* application, void* url, void* wxDelegate);
signed char SocialShareAPIForiOS_application_openURL_sourceApplication_annotation(void* application, void* url, void* sourceApplication, void* annotation, void* wxDelegate);

#endif /*__SocialShareAPIForiOS__H__*/