//
//  OnlineWallViewController.m
//  PluginDMOfferWall
//
//  Created by 1528 on 13-9-29.
//  Copyright (c) 2013年 1528. All rights reserved.
//

#import "OnlineWallViewController.h"
#import "PluginUtilsIOS.h"
#import "PluginManager.h"
#import "ProtocolSocial.h"

@implementation OnlineWallViewController


- (id) init : (NSString *) publishId
{
    self = [super initWithNibName:NULL bundle:NULL];
    self->_publishId = publishId;
    return self;
}

- (void) initController : (NSString*)userID
{
    if ( self )
    {
        _offerWallController = [[DMOfferWallViewController alloc] initWithPublisherID: _publishId andUserID:userID];
        _offerWallController.delegate = self;
        // test
        _offerWallController.disableStoreKit = YES;
    }
}

- (void) viewDidLoad
{
    [super viewDidLoad];
    _offerWallController.delegate = self;
}

- (void) dealloc
{
    _offerWallController.delegate = nil;
    _offerWallController = nil;
    [super dealloc];
}

- (void) offerWallDidStartLoad
{
    
}

- (void) offerWallDidFinishLoad
{
    
}

- (void) offerWallDidFailLoadWithError:(NSError *)error
{
    
}

- (void) showWithModal
{
    [_offerWallController presentOfferWall];
}

- (void) offerWallDidClosed
{
    cocos2d::plugin::PluginProtocol* plugin = cocos2d::plugin::PluginManager::getInstance()->loadPlugin("AnalyticsOfferWall");
    cocos2d::plugin::ProtocolSocial* ps = dynamic_cast<cocos2d::plugin::ProtocolSocial*>(plugin);
    ps->onShareResult(cocos2d::plugin::kShareSuccess, "WindowClosed");
}

// 积分查询
- (void) requestOnlinePointCheck
{   // 检查积分
    [_offerWallController requestOnlinePointCheck];
}	

// 领取积分
- (void) requestOnlineConsumeWithPoint : (NSUInteger)pointToConsume
{   //
    [_offerWallController requestOnlineConsumeWithPoint:pointToConsume];
}



#pragma mark Point Check Callbacks
// 积分查询成功之后，回调该接口，获取总积分和总已消费积分。
- (void)offerWallDidFinishCheckPointWithTotalPoint:(NSInteger)totalPoint
                             andTotalConsumedPoint:(NSInteger)consumed {
    // 查询积分失败
    cocos2d::plugin::PluginProtocol* plugin = cocos2d::plugin::PluginManager::getInstance()->loadPlugin("AnalyticsOfferWall");
    cocos2d::plugin::ProtocolSocial* ps = dynamic_cast<cocos2d::plugin::ProtocolSocial*>(plugin);
    NSString* str = [[NSString alloc] init];
    str = @"offerWallDidFinishCheck {\"totalPoint\" : ";
    str = [str stringByAppendingString:[NSString stringWithFormat:@"%d", totalPoint]];
    str = [str stringByAppendingString:@", \"consumed\":"];
    str = [str stringByAppendingString:[NSString stringWithFormat:@"%d", consumed]];
    str = [str stringByAppendingString:@"}"];

    ps->onShareResult(cocos2d::plugin::kShareSuccess, [str cStringUsingEncoding:NSASCIIStringEncoding]);
}

// 积分查询失败之后，回调该接口，返回查询失败的错误原因。
- (void)offerWallDidFailCheckPointWithError:(NSError *)error {
    // 查询积分失败
    cocos2d::plugin::PluginProtocol* plugin = cocos2d::plugin::PluginManager::getInstance()->loadPlugin("AnalyticsOfferWall");
    cocos2d::plugin::ProtocolSocial* ps = dynamic_cast<cocos2d::plugin::ProtocolSocial*>(plugin);
    ps->onShareResult(cocos2d::plugin::kShareSuccess, "offerWallDidFailCheck");
}

#pragma mark Consume Callbacks
// 消费请求正常应答后，回调该接口，并返回消费状态（成功或余额不足），以及总积分和总已消费积分。
- (void)offerWallDidFinishConsumePointWithStatusCode:(DMOfferWallConsumeStatusCode)statusCode
                                          totalPoint:(NSInteger)totalPoint
                                  totalConsumedPoint:(NSInteger)consumed {
    cocos2d::plugin::PluginProtocol* plugin = cocos2d::plugin::PluginManager::getInstance()->loadPlugin("AnalyticsOfferWall");
    cocos2d::plugin::ProtocolSocial* ps = dynamic_cast<cocos2d::plugin::ProtocolSocial*>(plugin);
    NSString* str = [[NSString alloc] init];
    str = @"offerWallDidFinishConsume {\"totalPoint\" : ";
    str = [str stringByAppendingString:[NSString stringWithFormat:@"%d", totalPoint]];
    str = [str stringByAppendingString:@", \"consumed\":"];
    str = [str stringByAppendingString:[NSString stringWithFormat:@"%d", consumed]];
    str = [str stringByAppendingString:@", \"statusCode\":"];
    str = [str stringByAppendingString:[NSString stringWithFormat:@"%d", statusCode]];
    str = [str stringByAppendingString:@"}"];
    
    ps->onShareResult(cocos2d::plugin::kShareSuccess, [str cStringUsingEncoding:NSASCIIStringEncoding]);
}

// 消费请求异常应答后，回调该接口，并返回异常的错误原因。
- (void)offerWallDidFailConsumePointWithError:(NSError *)error {
    cocos2d::plugin::PluginProtocol* plugin = cocos2d::plugin::PluginManager::getInstance()->loadPlugin("AnalyticsOfferWall");
    cocos2d::plugin::ProtocolSocial* ps = dynamic_cast<cocos2d::plugin::ProtocolSocial*>(plugin);
    ps->onShareResult(cocos2d::plugin::kShareSuccess, "offerWallDidFailConsume");
}

@end
