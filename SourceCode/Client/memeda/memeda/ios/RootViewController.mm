//
//  memedaAppController.h
//  memeda
//
//  Created by Lee Justin on 13-8-7.
//  Copyright __MyCompanyName__ 2013年. All rights reserved.
//

#import "RootViewController.h"

#include "DMInterstitialAdController.h"
#include "js_CommonFunction.h"

@implementation RootViewController
static DMInterstitialAdController* _dmInterstitial = NULL;
static BOOL    bInitAd = false;
static RootViewController* sRootViewController = NULL;

 // The designated initializer.  Override if you create the controller programmatically and want to perform customization that is not appropriate for viewDidLoad.
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil {
    if ((self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil])) {
        // Custom initialization
        bInitAd = false;
        sRootViewController = self;
    }
    return self;
}

+ (void)initAd {
    bInitAd = true;
    
    _dmInterstitial = [[DMInterstitialAdController alloc] initWithPublisherId:@"56OJzM8YuNPHElRuKG"
                                                                  placementId:@"16TLmePaApIe1NU-lBL4Mknk"
                                                           rootViewController:sRootViewController];
    
    _dmInterstitial.delegate = (NSObject <DMInterstitialAdControllerDelegate>*)sRootViewController;
    [_dmInterstitial loadAd];
}

+ (bool)presentAd {
    if ( bInitAd ) {
        if ( _dmInterstitial.isReady ) {
            [_dmInterstitial present];
            return true;
        }
    }
    return false;
}


// 当插屏⼲⼴广告被成功加载后,回调该⽅方法
- (void)dmInterstitialSuccessToLoadAd:(DMInterstitialAdController *)dmInterstitial {
    NSLog(@"dmInterstitialSuccessToLoadAd");
}

// 当插屏⼲⼴广告加载失败后,回调该⽅方法
- (void)dmInterstitialFailToLoadAd:(DMInterstitialAdController *)dmInterstitial withError:(NSError *)err {
    NSLog(@"dmInterstitialFailToLoadAd");
}

// 当插屏⼲⼴广告要被呈现出来前,回调该⽅方法
- (void)dmInterstitialWillPresentScreen:(DMInterstitialAdController *)dmInterstitial {
    NSLog(@"dmInterstitialWillPresentScreen");
}

// 当插屏⼲⼴广告被关闭后,回调该⽅方法
- (void)dmInterstitialDidDismissScreen:(DMInterstitialAdController *)dmInterstitial {
    [_dmInterstitial loadAd];
    NSLog(@"dmInterstitialDidDismissScreen");
    
    CommonFunction::onAdClosed();
}

// 当将要呈现出 Modal View 时,回调该⽅方法。如打开内置浏览器。
- (void)dmInterstitialWillPresentModalView:(DMInterstitialAdController *)dmInterstitial {
    NSLog(@"dmInterstitialWillPresentModalView");
}

// 当呈现的 Modal View 被关闭后,回调该⽅方法。如内置浏览器被关闭。
- (void)dmInterstitialDidDismissModalView:(DMInterstitialAdController *)dmInterstitial {
    NSLog(@"dmInterstitialDidDismissModalView");
}

// 当因⽤用户的操作(如点击下载类⼲⼴广告,需要跳转到Store),需要离开当前应⽤用时,回调该⽅方法
- (void)dmInterstitialApplicationWillEnterBackground:(DMInterstitialAdController *)dmInterstitial {
    NSLog(@"dmInterstitialApplicationWillEnterBackground");
}

/*
// Implement loadView to create a view hierarchy programmatically, without using a nib.
- (void)loadView {
}
*/
/*
// Implement viewDidLoad to do additional setup after loading the view, typically from a nib.
- (void)viewDidLoad {
    [super viewDidLoad];
    
    
}
*/

// Override to allow orientations other than the default portrait orientation.
// This method is deprecated on ios6
- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation {
    //return YES;
    return interfaceOrientation == UIInterfaceOrientationPortrait;
}

// For ios6, use supportedInterfaceOrientations & shouldAutorotate instead
- (NSUInteger) supportedInterfaceOrientations{
#ifdef __IPHONE_6_0
    return UIInterfaceOrientationMaskPortrait;
#endif
}

- (BOOL) shouldAutorotate {
    return YES;
}

- (void)didReceiveMemoryWarning {
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];
    
    // Release any cached data, images, etc that aren't in use.
}

- (void)viewDidUnload {
    [super viewDidUnload];
    // Release any retained subviews of the main view.
    // e.g. self.myOutlet = nil;
}


- (void)dealloc {
    _dmInterstitial.delegate = NULL;
    [super dealloc];
}

- (BOOL) prefersStatusBarHidden
{
    return YES;
}

@end
