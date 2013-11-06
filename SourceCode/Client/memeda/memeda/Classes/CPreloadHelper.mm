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
    return ;
    cocos2d::CCTextureCache* pTextureCache = cocos2d::CCTextureCache::sharedTextureCache();
 
    NSString* curPath = [[NSBundle mainBundle] resourcePath];
    NSLog(@"%@",curPath);
    
    NSString* aPath = [[NSString alloc] initWithString:@"/TestCCB/UI/"];
    NSFileManager* fileMananger = [NSFileManager defaultManager];
    NSError* error;
    NSString* fullPath = [curPath stringByAppendingString:aPath];
    NSArray* dirArray = [fileMananger contentsOfDirectoryAtPath:fullPath error:&error];
    for (int i = 0; i < [dirArray count]; i ++ )
    {
        NSString* file = [[NSString alloc] initWithFormat:@"/TestCCB/UI/%@/resources-iphonehd/",[dirArray objectAtIndex:i]];
        fullPath = [curPath stringByAppendingString:file];
        NSArray* subDirArray = [fileMananger contentsOfDirectoryAtPath:fullPath error:&error];
        for (int j = 0; j < [subDirArray count]; j ++ )
        {
            NSString* file = [[NSString alloc] initWithFormat:@"UI/%@/%@",[dirArray objectAtIndex:i], [subDirArray objectAtIndex:j]];
            
            NSLog(@"%@", file);
            pTextureCache->addImageAsync([file UTF8String], this, callfuncO_selector(CPreloadHelper::loadedCallback));
        }
    }
}

void CPreloadHelper::loadedCallback()
{
    
}