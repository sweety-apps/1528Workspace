//
//  CPreloadHelper.cpp
//  memeda
//
//  Created by 1528 on 13-10-11.
//
//

#include "CPreloadHelper.h"
#include <CCTextureCache.h>

#include <unistd.h>
#include <stdio.h>
#include <dirent.h>
#include <sys/stat.h>

using namespace cocos2d;

void CPreloadHelper::Preload()
{
    cocos2d::CCTextureCache* pTextureCache = cocos2d::CCTextureCache::sharedTextureCache();
 
    NSString* curPath = [[NSBundle mainBundle] resourcePath];
    NSLog(@"%@",curPath);
    
    NSString* aPath = [[NSString alloc] initWithString:@"/TestCCB/UI/guess/resources-iphone/"];
    NSError* error;
    
    NSString* fullPath = [curPath stringByAppendingString:aPath];
    
    NSFileManager* fileMananger = [NSFileManager defaultManager];
    NSArray* dirArray = [fileMananger contentsOfDirectoryAtPath:fullPath error:&error];
    for (int i = 0; i < [dirArray count]; i ++ )
    {
        NSString* file = [[NSString alloc] initWithFormat:@"UI/guess/%@",[dirArray objectAtIndex:i]];
        NSLog(@"%@", file);
        pTextureCache->addImageAsync([file UTF8String], this, callfuncO_selector(CPreloadHelper::loadedCallback));
    }
    
    //[dirArray release];
    
    aPath = [[NSString alloc] initWithString:@"/TestCCB/UI/levels/resources-iphone/"];
    fullPath = [curPath stringByAppendingString:aPath];
    dirArray = [fileMananger contentsOfDirectoryAtPath:fullPath error:&error];
    for (int i = 0; i < [dirArray count]; i ++ )
    {
        NSString* file = [[NSString alloc] initWithFormat:@"UI/levels/%@",[dirArray objectAtIndex:i]];
        NSLog(@"%@", file);
        pTextureCache->addImageAsync([file UTF8String], this, callfuncO_selector(CPreloadHelper::loadedCallback));
    }
    
    //[dirArray release];
    
    aPath = [[NSString alloc] initWithString:@"/TestCCB/UI/buy_coin_msgbox/resources-iphone/"];
    fullPath = [curPath stringByAppendingString:aPath];
    dirArray = [fileMananger contentsOfDirectoryAtPath:fullPath error:&error];
    for (int i = 0; i < [dirArray count]; i ++ )
    {
        NSString* file = [[NSString alloc] initWithFormat:@"UI/buy_coin_msgbox/%@",[dirArray objectAtIndex:i]];
        NSLog(@"%@", file);
        pTextureCache->addImageAsync([file UTF8String], this, callfuncO_selector(CPreloadHelper::loadedCallback));
    }
}

void CPreloadHelper::loadedCallback()
{
    
}