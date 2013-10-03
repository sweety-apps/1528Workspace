//
//  AnalyticsOfferWall.m
//  PluginDMOfferWall
//
//  Created by 1528 on 13-9-29.
//  Copyright (c) 2013年 1528. All rights reserved.
//

#import "AnalyticsOfferWall.h"
#import "PluginUtilsIOS.h"
#import "PluginManager.h"
#import "ProtocolSocial.h"

@implementation AnalyticsOfferWall

- (void) Init : (NSString*) publishid
{
    _Controller = [[OnlineWallViewController alloc] init:publishid];
    [_Controller initController:_userId];
}

- (void) SetUserID : (NSString*) userID
{
    _userId = userID;
}

- (void) ShowModal
{
    [_Controller showWithModal];
}

// 积分查询
- (void) requestOnlinePointCheck
{   // 检查积分
    [_Controller requestOnlinePointCheck];
}

// 领取积分
- (void) requestOnlineConsumeWithPoint : (NSUInteger)pointToConsume
{
    [_Controller requestOnlineConsumeWithPoint:pointToConsume];
}
@end
