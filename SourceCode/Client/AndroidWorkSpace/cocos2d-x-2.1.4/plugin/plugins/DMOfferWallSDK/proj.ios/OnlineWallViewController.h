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
}

- (id) init : (NSString *) publishId;
- (void) showWithModal;
@end