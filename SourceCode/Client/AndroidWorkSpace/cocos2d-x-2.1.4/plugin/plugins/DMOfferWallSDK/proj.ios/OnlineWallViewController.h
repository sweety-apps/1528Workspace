//
//  OnlineWallViewController.h
//  PluginDMOfferWall
//
//  Created by 1528 on 13-9-29.
//  Copyright (c) 2013年 1528. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "DMOfferWallViewController.h"

@interface OnlineWallViewController :
UIViewController<DMOfferWallDelegate, UITextFieldDelegate>
{
    DMOfferWallViewController* _offerWallController;
    NSString* _userID;
    NSString * _publishId;
}

- (id) init : (NSString *) publishId;

- (void) initController : (NSString*)userID;

- (void) showWithModal;

- (void) requestOnlinePointCheck;
// 领取积分
- (void) requestOnlineConsumeWithPoint : (NSUInteger)pointToConsume;

@end