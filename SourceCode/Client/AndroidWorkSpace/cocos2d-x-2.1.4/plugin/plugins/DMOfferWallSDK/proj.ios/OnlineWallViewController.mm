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
    if ( self )
    {
        _offerWallController = [[DMOfferWallViewController alloc]initWithPublisherID: publishId];
        _offerWallController.delegate = self;
    }
    return self;
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
@end
