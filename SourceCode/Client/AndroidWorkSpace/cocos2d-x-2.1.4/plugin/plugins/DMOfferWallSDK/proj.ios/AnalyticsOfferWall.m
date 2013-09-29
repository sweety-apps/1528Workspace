//
//  AnalyticsOfferWall.m
//  PluginDMOfferWall
//
//  Created by 1528 on 13-9-29.
//  Copyright (c) 2013年 1528. All rights reserved.
//

#import "AnalyticsOfferWall.h"

@implementation AnalyticsOfferWall

- (void) Init : (NSString*) publishid
{
    _Controller = [[OnlineWallViewController alloc] init:publishid];
}

- (void) ShowModal
{
    [_Controller showWithModal];
}

@end
