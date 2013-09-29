//
//  AnalyticsOfferWall.h
//  PluginDMOfferWall
//
//  Created by 1528 on 13-9-29.
//  Copyright (c) 2013年 1528. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <InterfaceSocial.h>
#import "OnlineWallViewController.h"

@interface AnalyticsOfferWall : NSObject<InterfaceSocial>
{
    OnlineWallViewController* _Controller;
}

- (void) Init : (NSString*) id;
- (void) ShowModal ;
@end
