//
//  AppConfigVarDefines.h
//  memeda
//
//  Created by Lee Justin on 13-9-23.
//
//

#ifndef memeda_AppConfigVarDefines_h
#define memeda_AppConfigVarDefines_h

#include "cocos2d.h"

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)

#define kShareSDKAppId @"982e185ccb2"
#define kWeixinAppId @"wxdea41cab84b6c578"
#define kUmengAppId "523e8a0856240bb65f01a5c7"
#define kOfferWallPubID "96ZJ2rNgzeykPwTA/a"
//#define kOfferWallPubID "96ZJ06UgzeimTwTAs3"

#elif (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)

#define kShareSDKAppId @"98333c6897c"
#define kWeixinAppId @"wxdea41cab84b6c578"
#define kUmengAppId "5282175156240b5d3e00e748"
#define kOfferWallPubID "96ZJ3qMgzeykPwTA6q"
//#define kOfferWallPubID "96ZJ2b8QzehB3wTAwQ"

#endif /*CC_TARGET_PLATFORM*/

#endif
