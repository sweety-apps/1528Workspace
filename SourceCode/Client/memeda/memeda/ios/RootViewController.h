//
//  memedaAppController.h
//  memeda
//
//  Created by Lee Justin on 13-8-7.
//  Copyright __MyCompanyName__ 2013年. All rights reserved.
//

#import <UIKit/UIKit.h>
#include "DMInterstitialAdController.h"

@interface RootViewController : UIViewController<DMInterstitialAdControllerDelegate> {
}

+ (void)initAd;
+ (void)presentAd;

@end
