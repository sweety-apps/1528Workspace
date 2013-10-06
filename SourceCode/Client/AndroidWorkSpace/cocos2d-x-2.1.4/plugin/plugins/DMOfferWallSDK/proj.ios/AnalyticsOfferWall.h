//
//  AnalyticsOfferWall.h
//  PluginDMOfferWall
//
//  Created by 1528 on 13-9-29.
//  Copyright (c) 2013年 1528. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "InterfaceSocial.h"
#import "OnlineWallViewController.h"


@interface AnalyticsOfferWall : NSObject<InterfaceSocial>
{
    OnlineWallViewController* _Controller;
    NSString* _userId;
}

- (void) Init : (NSString*) publishid;
- (void) SetUserID : (NSString*) userID;
- (void) ShowModal ;

// 积分查询
- (void) requestOnlinePointCheck;
- (void) requestOnlineConsumeWithPoint : (NSNumber*) pointToConsume;
@end
