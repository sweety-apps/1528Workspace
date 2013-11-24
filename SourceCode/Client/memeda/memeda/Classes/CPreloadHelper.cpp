//
//  CPreloadHelper.cpp
//  memeda
//
//  Created by 1528 on 13-10-11.
//
//

#include "cocos2d.h"

#include "CPreloadHelper.h"
#include "CCTextureCache.h"

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#include "CPreloadHelperAndroidVar.h"
#endif

#include <unistd.h>
#include <stdio.h>
#include <dirent.h>
#include <sys/stat.h>



using namespace cocos2d;

void* CPreloadHelper::PreloadThread(void* pobj)
{
    CPreloadHelper* pHelper = (CPreloadHelper*)pobj;
    
    pHelper->load();
    
    return 0;
}

void CPreloadHelper::load()
{
    CCLOG("[Load Cache image] %s","=== Start Loding ===");

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    loadAndroid();
    CCLOG("[Load Cache image] %s","=== End Loding ===");
    return;
#endif
    
    std::string mainFileName = "main.js";
    
    cocos2d::CCTextureCache* pTextureCache = cocos2d::CCTextureCache::sharedTextureCache();
    
    std::string uiFolderName = "UI";
    std::string uiPath = "/";
    uiPath = uiPath.append(uiFolderName);
    std::string fullPath = CCFileUtils::sharedFileUtils()->fullPathForFilename(mainFileName.c_str());
    
    std::vector<std::string> imageFolder(3);
    imageFolder[0] = "/resources-iphonehd";
    imageFolder[1] = "/resources-large";
    imageFolder[2] = "/resources-small";
    
    std::string androidFileListVarLarge = "";
    std::string androidFileListVarSmall = "";
    
    //有main.js文件，则从这一层开始遍历增加文件
    if (fullPath.length() > 0)
    {
        std::string resourceDir = fullPath.substr(0,fullPath.find_last_of("/"));
        resourceDir = resourceDir.append(uiPath);
        CCLOG("%s",resourceDir.c_str());
        
        DIR* dir = NULL;
        struct dirent* ent = NULL;
        dir = opendir(resourceDir.c_str());
        if (dir != NULL)
        {
            while((ent=readdir(dir))!=NULL)
            {
                if(ent->d_type & DT_DIR)
                {
                    if(strcmp(ent->d_name,".")==0 || strcmp(ent->d_name,"..")==0)
                        continue;
                    
                    //遍历自适应文件夹下内的图片
                    DIR* imageDir = NULL;
                    struct dirent* imagEnt = NULL;
                    for (int i = 0; i < imageFolder.size(); ++i)
                    {
                        std::string folderName = imageFolder[i];
                        std::string folderPath = resourceDir;
                        folderPath = folderPath.append("/");
                        folderPath = folderPath.append(ent->d_name);
                        folderPath = folderPath.append(folderName);
                        imageDir = opendir(folderPath.c_str());
                        if (imageDir != NULL)
                        {
                            while((imagEnt=readdir(imageDir))!=NULL)
                            {
                                if(imagEnt->d_type & DT_DIR)
                                {
                                    //文件夹就啥都不做
                                }
                                else
                                {
                                    if (strstr(imagEnt->d_name, ".png") != NULL)
                                    {
                                        std::string fileNameForCocos = "";
                                        fileNameForCocos = fileNameForCocos.append(uiFolderName).append("/").append(ent->d_name).append(imageFolder[i]).append("/").append(imagEnt->d_name);
                                        //Add to android Large
                                        std::string androidFilePathLarge = "";
                                        androidFilePathLarge = androidFilePathLarge.append(uiFolderName).append("/").append(ent->d_name).append("/resources-large").append("/").append(imagEnt->d_name);
                                        
                                        androidFileListVarLarge = androidFileListVarLarge.append("\"").append(androidFilePathLarge).append("\",\n");
                                        //Add to android Small
                                        std::string androidFilePathSmall = "";
                                        androidFilePathSmall = androidFilePathSmall.append(uiFolderName).append("/").append(ent->d_name).append("/resources-small").append("/").append(imagEnt->d_name);
                                        
                                        androidFileListVarSmall = androidFileListVarSmall.append("\"").append(androidFilePathSmall).append("\",\n");
                                        //push into cache
                                        CCLOG("[Load Cache image] %s",fileNameForCocos.c_str());
                                        pTextureCache->addImageAsync(fileNameForCocos.c_str(), this, callfuncO_selector(CPreloadHelper::loadedCallback));
                                    }
                                }
                            }
                            closedir(imageDir);
                        }
                    }
                }
                else
                {
                    //cout<<ent->d_name<<endl;
                }
            }
            closedir(dir);
        }
        
        //打开这里以获取安卓变量
        //CCLOG("[Android FileList Start Large] \n %s [Android FileList End Large]",androidFileListVarLarge.c_str());
        //CCLOG("[Android FileList Start Large] \n %s [Android FileList End Large]",androidFileListVarSmall.c_str());
    }
    
    
    CCLOG("[Load Cache image] %s","=== End Loding ===");
#if 0
        DIR* dir = NULL;
        dir = opendir(fullPath);
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
#endif
}

void CPreloadHelper::Preload()
{
    pthread_t id;
    pthread_attr_t attr;
    
    pthread_attr_init(&attr);
    pthread_attr_setdetachstate(&attr, PTHREAD_CREATE_DETACHED);
    
    pthread_create(&id, &attr, PreloadThread, this);
}

void CPreloadHelper::loadedCallback()
{
    
}


#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)

void CPreloadHelper::loadAndroid()
{
    char** strList = NULL;
    int strListCount = 0;
    if (this->androidResourceType == kCPreloadHelperAndroidResourceTypeLarge)
    {
        strList = CPreloadHelperAndroidVar_Large_List();
        strListCount = CPreloadHelperAndroidVar_Large_Count();
    }
    if (this->androidResourceType == kCPreloadHelperAndroidResourceTypeSmall)
    {
        strList = CPreloadHelperAndroidVar_Small_List();
        strListCount = CPreloadHelperAndroidVar_Small_Count();
    }
    
    if (strList)
    {
        for (int i = 0; i < strListCount; ++i)
        {
            if (CCFileUtils::sharedFileUtils()->isFileExist(strList[i]))
            {
                cocos2d::CCTextureCache* pTextureCache = cocos2d::CCTextureCache::sharedTextureCache();
                pTextureCache->addImage(strList[i]);
                //pTextureCache->addImageAsync(strList[i], this, callfuncO_selector(CPreloadHelper::loadedCallback));
                CCLOG("[Load Cache image] %s",strList[i]);
            }
            
        }
    }
}

#else
void CPreloadHelper::loadAndroid()
{
    //Do Nothing
}
#endif



//#endif