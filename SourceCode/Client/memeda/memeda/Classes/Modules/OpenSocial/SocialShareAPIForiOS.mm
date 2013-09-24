//
//  SocialShareAPIForiOS.m
//  memeda
//
//  Created by Lee Justin on 13-9-23.
//
//

#import <Foundation/Foundation.h>
#import "SocialShareAPIForiOS.h"

// ShareSDK 分享
#import <ShareSDK/ShareSDK.h>
#import "WXApi.h"
#import "AppConfigVarDefines.h"

static int gHasInited = 0;

void SocialShareAPIForiOS_initShareAPI()
{
    if (!gHasInited)
    {
        // 初始化ShareSDK
        [ShareSDK registerApp:kShareSDKAppId];     //参数为ShareSDK官网中添加应用后得到的AppKey
        
        //添加微信应用
        [ShareSDK connectWeChatWithAppId:kWeixinAppId   //此参数为申请的微信AppID
                               wechatCls:[WXApi class]];
        /*
         //添加新浪微博应用
         [ShareSDK connectSinaWeiboWithAppKey:@"3201194191"
         appSecret:@"0334252914651e8f76bad63337b3b78f"
         redirectUri:@"http://appgo.cn"];
         
         //添加腾讯微博应用
         [ShareSDK connectTencentWeiboWithAppKey:@"801307650"
         appSecret:@"ae36f4ee3946e1cbb98d6965b0b2ff5c"
         redirectUri:@"http://www.sharesdk.cn"];
         */
        gHasInited = 1;
    }
}

void SocialShareAPIForiOS_uninitShareAPI()
{
    gHasInited = 0;
}


void SocialShareAPIForiOS_doTestShare()
{
    if (gHasInited)
    {
        NSString *imagePath = [[NSBundle mainBundle] pathForResource:@"ShareSDK"  ofType:@"jpg"];
        
        //构造分享内容
        id<ISSContent> publishContent = [ShareSDK content:@"分享内容"
                                           defaultContent:@"默认分享内容，没内容时显示"
                                                    image:[ShareSDK imageWithPath:imagePath]
                                                    title:@"ShareSDK"
                                                      url:@"http://www.sharesdk.cn"
                                              description:@"这是一条测试信息"
                                                mediaType:SSPublishContentMediaTypeNews];
        
        [ShareSDK shareContent:publishContent
                          type:ShareTypeWeixiTimeline
                   authOptions:nil
                  shareOptions:nil
                 statusBarTips:YES
                        result:^(ShareType type, SSPublishContentState state, id<ISSStatusInfo> statusInfo, id<ICMErrorInfo> error, BOOL end) {
                            if (state == SSPublishContentStateSuccess)
                            {
                                CCLOG("分享成功");
                            }
                            else if (state == SSPublishContentStateFail)
                            {
                                CCLOG("分享失败,错误码:%d,错误描述:%s", [error errorCode], [[error errorDescription] UTF8String]);
                            }
                        }];
    }
}

void SocialShareAPIForiOS_shareWeChatURL(std::string content, std::string imagePath,std::string title, std::string url, std::string description ,bool isTimeline,void* callbackFunction,void* callbackFunctionContext)
{
    if (gHasInited)
    {
        NSString* contentStr = [NSString stringWithUTF8String:content.c_str()];
        NSString* imagePathStr = [NSString stringWithUTF8String:imagePath.c_str()];
        NSString* titleStr = [NSString stringWithUTF8String:title.c_str()];
        NSString* urlStr = [NSString stringWithUTF8String:url.c_str()];
        NSString* descriptionStr = [NSString stringWithUTF8String:description.c_str()];
        ShareType shareType = isTimeline ? ShareTypeWeixiTimeline : ShareTypeWeixiSession;
        
        //构造分享内容
        id<ISSContent> publishContent = [ShareSDK content:contentStr
                                           defaultContent:@"么么答"
                                                    image:[ShareSDK imageWithPath:imagePathStr]
                                                    title:titleStr
                                                      url:urlStr
                                              description:descriptionStr
                                                mediaType:SSPublishContentMediaTypeNews];
        
        [ShareSDK shareContent:publishContent
                          type:shareType
                   authOptions:nil
                  shareOptions:nil
                 statusBarTips:YES
                        result:^(ShareType type, SSPublishContentState state, id<ISSStatusInfo> statusInfo, id<ICMErrorInfo> error, BOOL end) {
                            const char* stateStr = "";
                            switch (state)
                            {
                                case SSPublishContentStateBegan:
                                stateStr = kSocialShareStateBegan;
                                break;
                                case SSPublishContentStateSuccess:
                                stateStr = kSocialShareStateSuccess;
                                break;
                                case SSPublishContentStateFail:
                                stateStr = kSocialShareStateFail;
                                break;
                                case SSPublishContentStateCancel:
                                stateStr = kSocialShareStateCancel;
                                break;
                                
                                default:
                                break;
                            }
                            const char* errMsgStr = "";
                            if (error)
                            {
                                errMsgStr = [[error errorDescription] UTF8String];
                            }
                            
                            if (state == SSPublishContentStateSuccess)
                            {
                                CCLOG("分享成功");
                            }
                            else if (state == SSPublishContentStateFail)
                            {
                                CCLOG("分享失败,错误码:%d,错误描述:%s", [error errorCode], [[error errorDescription] UTF8String]);
                            }
                            
                            if (callbackFunction)
                            {
                                ((WeChatShareCallback)callbackFunction)(stateStr,errMsgStr,callbackFunctionContext);
                            }
                        }];
    }
}

signed char SocialShareAPIForiOS_application_handleOpenURL(void* application, void* url, void* wxDelegate)
{
    return [ShareSDK handleOpenURL:(NSURL*)url
                        wxDelegate:(id)wxDelegate];
}

signed char SocialShareAPIForiOS_application_openURL_sourceApplication_annotation(void* application, void* url, void* sourceApplication, void* annotation, void* wxDelegate)
{
    return [ShareSDK handleOpenURL:(NSURL*)url
                 sourceApplication:(NSString *)sourceApplication
                        annotation:(id)annotation
                        wxDelegate:(id)wxDelegate];
}
