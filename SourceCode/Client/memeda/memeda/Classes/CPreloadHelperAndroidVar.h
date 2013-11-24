//
//  CPreloadHelperAndroidVar.h
//  memeda
//
//  Created by Lee Justin on 13-11-23.
//
//

#ifndef memeda_CPreloadHelperAndroidVar_h
#define memeda_CPreloadHelperAndroidVar_h

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)

char** CPreloadHelperAndroidVar_Large_List();
int CPreloadHelperAndroidVar_Large_Count();

char** CPreloadHelperAndroidVar_Small_List();
int CPreloadHelperAndroidVar_Small_Count();

#endif

#endif
