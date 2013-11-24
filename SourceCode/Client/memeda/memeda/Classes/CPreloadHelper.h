//
//  CPreloadHelper.h
//  memeda
//
//  Created by 1528 on 13-10-11.
//
//

#ifndef __memeda__CPreloadHelper__
#define __memeda__CPreloadHelper__

#include <cocoa/CCObject.h>

typedef int CPreloadHelperAndroidResourceType;

#define kCPreloadHelperAndroidResourceTypeLarge (1)
#define kCPreloadHelperAndroidResourceTypeSmall (2)

class CPreloadHelper : public cocos2d::CCObject
{
public:
    void Preload();
    void load();
    void loadAndroid();
    void loadedCallback();
    CPreloadHelperAndroidResourceType androidResourceType;
    
    static void* PreloadThread(void*);
};

#endif /* defined(__memeda__CPreloadHelper__) */
