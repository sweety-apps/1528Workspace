#include "AppDelegate.h"

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

#include "jsb_SocialShareAPI.hpp"
#include "uncompressZipFile.h"
#include "Stat.h"

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
    
    TargetPlatform platform = CCApplication::sharedApplication()->getTargetPlatform();
    if (platform == kTargetIphone || platform == kTargetIpad)
    {
        std::vector<std::string> searchPaths = CCFileUtils::sharedFileUtils()->getSearchPaths();
        searchPaths.insert(searchPaths.begin(), "TestCCB");
        CCFileUtils::sharedFileUtils()->setSearchPaths(searchPaths);
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
            resDirOrders.push_back("resources-iphone");
            resizeFactor = 1.0;
        }
        
    }
    else if (platform == kTargetAndroid || platform == kTargetWindows)
    {
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
        
        resizeFactor = resourceSize.width/designSize.width;
        
        designSize.height = designSize.width * screenSize.height / screenSize.width;
    }
    
    CCFileUtils::sharedFileUtils()->setSearchResolutionsOrder(resDirOrders);
    
    //pDirector->setContentScaleFactor(resourceSize.width/designSize.width);
    pDirector->setContentScaleFactor(resizeFactor);
    
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
    sc->addRegisterCallback(js_register_jsb_SocialShareAPI_SocialShareAPI);
    sc->addRegisterCallback(js_register_jsb_SocialShareAPI_WeChatShareCallBackClass);

    // 初始化友盟统计
    CStat* pStat = CStat::GetInstance();
    pStat->Init();
    sc->addRegisterCallback(CStatParam::_js_register);
    sc->addRegisterCallback(CStat::_js_register);
    
    sc->start();
    
    CCScriptEngineProtocol *pEngine = ScriptingCore::getInstance();
    CCScriptEngineManager::sharedManager()->setScriptEngine(pEngine);
    
    ScriptingCore::getInstance()->runScript("main.js");
    pStat->logTimedEventBegin("runtime");   //
    
    //testUnzipFiles();
    
    return true;
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
    CStat* pStat = CStat::GetInstance();
    pStat->logTimedEventEnd("runtime");   //
    
    CCDirector::sharedDirector()->stopAnimation();
    SimpleAudioEngine::sharedEngine()->pauseBackgroundMusic();
    SimpleAudioEngine::sharedEngine()->pauseAllEffects();
}

// this function will be called when the app is active again
void AppDelegate::applicationWillEnterForeground()
{
    CStat* pStat = CStat::GetInstance();
    pStat->logTimedEventBegin("runtime");   //
    
    CCDirector::sharedDirector()->startAnimation();
    SimpleAudioEngine::sharedEngine()->resumeBackgroundMusic();
    SimpleAudioEngine::sharedEngine()->resumeAllEffects();
}


