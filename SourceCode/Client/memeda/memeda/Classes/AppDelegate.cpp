#include "AppDelegate.h"

#include <stdio.h>
#include <stdlib.h>

#include "cocos2d.h"
#include "SimpleAudioEngine.h"
#include "ScriptingCore.h"
#include "jsb_cocos2dx_auto.hpp"
#include "jsb_cocos2dx_extension_auto.hpp"
#include "jsb_cocos2dx_extension_manual.h"
#include "cocos2d_specifics.hpp"
#include "js_bindings_chipmunk_registration.h"
#include "js_bindings_ccbreader.h"
#include "js_bindings_system_registration.h"
#include "jsb_opengl_registration.h"
#include "XMLHTTPRequest.h"
#include "js_OfferWallController.h"
#include "jsb_SocialShareAPI.hpp"
#include "jsb_iOSiapWrapper.hpp"
//#include "uncompressZipFile.h"
#include "Stat.h"
#include "js_CommonFunction.h"
#include "LocalStorage.h"
#include "Game_Util_Functions.h"
#include "SocialShareAPI.h"

USING_NS_CC;
using namespace CocosDenshion;

AppDelegate::AppDelegate()
{
}

AppDelegate::~AppDelegate()
{
    //    SimpleAudioEngine::end();
}

bool AppDelegate::applicationDidFinishLaunching()
{
    //初始化分享
    SocialShareAPI::getInstance()->initShareAPI();
    
    // initialize director
    CCDirector *pDirector = CCDirector::sharedDirector();
    pDirector->setOpenGLView(CCEGLView::sharedOpenGLView());
    
    pDirector->setProjection(kCCDirectorProjection2D);
    
    CCSize screenSize = CCEGLView::sharedOpenGLView()->getFrameSize();
    
    CCSize designSize = CCSizeMake(320, 480);
    CCSize resourceSize = CCSizeMake(320, 480);
    
    //对不准了，注意改这个参数
    float resizeFactor = 1.0;
    
    std::vector<std::string> resDirOrders;
    
    ResolutionPolicy resolutionPolicy = kResolutionNoBorder;
    
    TargetPlatform platform = CCApplication::sharedApplication()->getTargetPlatform();
    if (platform == kTargetIphone || platform == kTargetIpad)
    {
        std::vector<std::string> searchPaths = CCFileUtils::sharedFileUtils()->getSearchPaths();
        searchPaths.insert(searchPaths.begin(), "TestCCB");
        CCFileUtils::sharedFileUtils()->setSearchPaths(searchPaths);
        
        if (platform == kTargetIphone)
        {
            if (screenSize.height > 1136)
            {
                designSize = CCSizeMake(384, 512);
                resourceSize = CCSizeMake(1536, 2048);
                resDirOrders.push_back("resources-ipadhd");
                resDirOrders.push_back("resources-ipad");
                resDirOrders.push_back("resources-iphonehd");
                resizeFactor = 4.0;
            }
            else if (screenSize.height > 1024)
            {
                designSize = CCSizeMake(320, 568);
                resourceSize = CCSizeMake(640, 1136);
                resDirOrders.push_back("resources-ipad");
                resDirOrders.push_back("resources-iphonehd");
                resizeFactor = 2.0;
            }
            else if (screenSize.height > 960)
            {
                designSize = CCSizeMake(384, 512);
                resourceSize = CCSizeMake(768, 1024);
                resDirOrders.push_back("resources-ipad");
                resDirOrders.push_back("resources-iphonehd");
                resizeFactor = 2.0;
            }
            else if (screenSize.height > 480)
            {
                designSize = CCSizeMake(320, 480);
                resourceSize = CCSizeMake(640, 960);
                resDirOrders.push_back("resources-iphonehd");
                resDirOrders.push_back("resources-iphone");
                resizeFactor = 2.0;
            }
            else
            {
                designSize = CCSizeMake(320, 480);
                resourceSize = CCSizeMake(320, 480);
                resDirOrders.push_back("resources-iphonehd");
                resDirOrders.push_back("resources-iphone");
                resizeFactor = 2.0;
            }
        }
        else
        {
            // for iPad, Just Scale Up
            designSize = CCSizeMake(320, 426);
            resourceSize = CCSizeMake(640, 960);
            resDirOrders.push_back("resources-iphonehd");
            resDirOrders.push_back("resources-iphone");
            resizeFactor = resourceSize.width/designSize.width;
        }
        
        
        resolutionPolicy = kResolutionNoBorder;
        
    }
    else if (platform == kTargetAndroid || platform == kTargetWindows)
    {
#if 0
        if (screenSize.height > 960)
        {
            resourceSize = CCSizeMake(1280, 1920);
            resDirOrders.push_back("resources-xlarge");
            resDirOrders.push_back("resources-large");
            resDirOrders.push_back("resources-medium");
            resDirOrders.push_back("resources-small");
        }
        else if (screenSize.height > 720)
        {
            resourceSize = CCSizeMake(640, 960);
            resDirOrders.push_back("resources-large");
            resDirOrders.push_back("resources-medium");
            resDirOrders.push_back("resources-small");
        }
        else if (screenSize.height > 480)
        {
            resourceSize = CCSizeMake(480, 720);
            resDirOrders.push_back("resources-medium");
            resDirOrders.push_back("resources-small");
        }
        else
        {
            resourceSize = CCSizeMake(320, 480);
            resDirOrders.push_back("resources-small");
        }
#endif
        if (screenSize.height > 720)
        {
            if(screenSize.height / screenSize.width >= 1136/640)
            {
                resourceSize = CCSizeMake(640, 1136);
            }
            else
            {
                resourceSize = CCSizeMake(640, 960);
            }
            resDirOrders.push_back("resources-large");
            //resDirOrders.push_back("resources-medium");
            resDirOrders.push_back("resources-small");
        }
        else
        {
            if(screenSize.height / screenSize.width >= 568/320)
            {
                resourceSize = CCSizeMake(320, 568);
            }
            else
            {
                resourceSize = CCSizeMake(320, 480);
            }
            resDirOrders.push_back("resources-small");
        }
        
        resolutionPolicy = kResolutionFixedWidth;
        
        resizeFactor = resourceSize.width/designSize.width;
        
        //designSize.height = designSize.width * resourceSize.height / resourceSize.width;
        designSize.height = designSize.width * screenSize.height / screenSize.width;
    }
    
    CCFileUtils::sharedFileUtils()->setSearchResolutionsOrder(resDirOrders);
    
    //pDirector->setContentScaleFactor(resourceSize.width/designSize.width);
    pDirector->setContentScaleFactor(resizeFactor);
    
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    m_Helper.Preload();
#endif
    
    CCEGLView::sharedOpenGLView()->setDesignResolutionSize(designSize.width, designSize.height, kResolutionNoBorder);
    
    
    // turn on display FPS
    pDirector->setDisplayStats(false);//pDirector->setDisplayStats(true);//
    
    // set FPS. the default value is 1.0/60 if you don't call this
    pDirector->setAnimationInterval(1.0 / 60);
    
    ScriptingCore* sc = ScriptingCore::getInstance();
    sc->addRegisterCallback(register_all_cocos2dx);
    sc->addRegisterCallback(register_all_cocos2dx_extension);
    sc->addRegisterCallback(register_cocos2dx_js_extensions);
    sc->addRegisterCallback(register_all_cocos2dx_extension_manual);
    sc->addRegisterCallback(register_CCBuilderReader);
    sc->addRegisterCallback(jsb_register_chipmunk);
    sc->addRegisterCallback(jsb_register_system);
    sc->addRegisterCallback(JSB_register_opengl);
    sc->addRegisterCallback(MinXmlHttpRequest::_js_register);
    sc->addRegisterCallback(js_OfferWallController::_js_register);
    sc->addRegisterCallback(register_all_jsb_SocialShareAPI);
    
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    sc->addRegisterCallback(register_all_jsb_iOSiapWrapper);
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#endif /*CC_TARGET_PLATFORM*/
    
    sc->addRegisterCallback(CommonFunction::_js_register);
    
    // 初始化友盟统计
    CStat* pStat = CStat::GetInstance();
    pStat->Init();
    sc->addRegisterCallback(CStatParam::_js_register);
    sc->addRegisterCallback(CStat::_js_register);
    
    sc->start();
    
    CCScriptEngineProtocol *pEngine = ScriptingCore::getInstance();
    CCScriptEngineManager::sharedManager()->setScriptEngine(pEngine);
    
    ResetCoin();
    
    ScriptingCore::getInstance()->runScript("main.js");
    //ScriptingCore::getInstance()->runScript("hello.js");

    pStat->logTimedEventBegin("runtime");   //
    
    //testUnzipFiles();
   
    //UInt32 category = AVAudioSessionCategoryPlayAndRecord;
    //AudioSessionSetProperty(kAudioSessionProperty_AudioCategory, sizeof(category), &category);
    
    //UInt32 route = kAudioSessionOverrideAudioRoute_None;
    //AudioSessionSetProperty(kAudioSessionProperty_OverrideAudioRoute, sizeof(route), &route);
    SimpleAudioEngine::sharedEngine()->setEffectsVolume(0.8);
    
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    CommonFunction_Notify_Splash_Fade();
#endif
    
    return true;
}

void AppDelegate::ResetCoin()
{
    // 判断是否恢复金币
    const char* szLocalNotify = localStorageGetItem("localNotification");
    if ( szLocalNotify != NULL && strcmp(szLocalNotify, "") != 0 )
    {
        CCLOG("time : %s", szLocalNotify);
        
        char* szStopString;
        const char* szCoin = localStorageGetItem("coin");
        long lCoin = 50;
        if ( szCoin != NULL )
        {
            lCoin = strtol(szCoin, &szStopString, 10);
        }
        if ( lCoin < 50 )
        {
            double time = Game_Util_getIntervalSecondsFromDateString(szLocalNotify);
            int nDays= ((int)time)/(3600*24);
            if ( nDays >= 5 )
            {   // 相差超过5天，增加金币
                localStorageSetItem("coin", "100");
            }
        }
        
        localStorageSetItem("localNotification", "");
    }
    
    // 判断是否是覆盖安装
    const char* szProblem = localStorageGetItem("problem_project");
    if ( szProblem != NULL )
    {   // 覆盖安装
        const char* szAward = localStorageGetItem("installaward");
        if ( szAward == NULL ) {
            // 覆盖安装奖励
            const char* szCoin = localStorageGetItem("coin");
            if ( szCoin != NULL )
            {
                char* szStopString;
                long lCoin = strtol(szCoin, &szStopString, 10);
                lCoin += 100;
                char szNewCoin[128];
                sprintf(szNewCoin, "%ld", lCoin);
                localStorageSetItem("coin", szNewCoin);
            }
            else
            {
                localStorageSetItem("coin", "150");
            }
        }
    }
    // 不是覆盖不加金币
    localStorageSetItem("installaward", "1");
}

void handle_signal(int signal) {
    static int internal_state = 0;
    ScriptingCore* sc = ScriptingCore::getInstance();
    // should start everything back
    CCDirector* director = CCDirector::sharedDirector();
    if (director->getRunningScene()) {
        director->popToRootScene();
    } else {
        CCPoolManager::sharedPoolManager()->finalize();
        if (internal_state == 0) {
            //sc->dumpRoot(NULL, 0, NULL);
            sc->start();
            internal_state = 1;
        } else {
            sc->runScript("main.js");
            internal_state = 0;
        }
    }
}

// This function will be called when the app is inactive. When comes a phone call,it's be invoked too
void AppDelegate::applicationDidEnterBackground()
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    CStat* pStat = CStat::GetInstance();
    pStat->logTimedEventEnd("runtime");   //
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#endif /*CC_TARGET_PLATFORM*/
    
    CCDirector::sharedDirector()->stopAnimation();
    SimpleAudioEngine::sharedEngine()->pauseBackgroundMusic();
    SimpleAudioEngine::sharedEngine()->pauseAllEffects();
}

// this function will be called when the app is active again
void AppDelegate::applicationWillEnterForeground()
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    CStat* pStat = CStat::GetInstance();
    pStat->logTimedEventBegin("runtime");   //
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#endif /*CC_TARGET_PLATFORM*/
    
    CCDirector::sharedDirector()->startAnimation();
    SimpleAudioEngine::sharedEngine()->resumeBackgroundMusic();
    SimpleAudioEngine::sharedEngine()->resumeAllEffects();
    
    SimpleAudioEngine::sharedEngine()->setEffectsVolume(0.8);
}


