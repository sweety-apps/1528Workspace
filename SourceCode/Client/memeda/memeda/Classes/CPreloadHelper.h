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

class CPreloadHelper : public cocos2d::CCObject
{
public:
    void Preload();
    void load();
    void loadedCallback();
    
    static void* PreloadThread(void*);
};

#endif /* defined(__memeda__CPreloadHelper__) */
