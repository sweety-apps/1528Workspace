//
//  memedaAppController.h
//  memeda
//
//  Created by Lee Justin on 13-8-7.
//  Copyright __MyCompanyName__ 2013年. All rights reserved.
//

#import <UIKit/UIKit.h>

@protocol DMInterstitialAdControllerDelegate;

@interface RootViewController : UIViewController<DMInterstitialAdControllerDelegate> {
}

+ (void)initAd;
+ (bool)presentAd;

@end
