//
//  js_CommonFunction.h
//  memeda
//
//  Created by 1528 on 13-10-4.
//
//

#ifndef memeda_js_CommonFunction_h
#define memeda_js_CommonFunction_h

#include "js_bindings_config.h"
#include "ScriptingCore.h"
#include "jstypes.h"
#include "jsapi.h"
#include "jsfriendapi.h"
#include "jsb_helper.h"

class CommonFunction : public cocos2d::CCObject
{
public:
    static void _js_register(JSContext *cx, JSObject *global);
    
    static JSClass* jsb_Class;
    static JSObject* jsb_prototype;
    
    static void Finialize(JSFreeOp* fop, JSObject* obj);
    
    static JSBool openURL(JSContext* cx, uint32_t argc, jsval* vp);
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    static JSBool setActualDefaultRingtoneUri(JSContext* cx, uint32_t argc, jsval* vp);
#endif
    
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS ) 
    static JSBool getReportActiveURL(JSContext* cx, uint32_t argc, jsval* vp);
    
    static JSBool initAd(JSContext* cx, uint32_t argc, jsval* vp);
    static JSBool presentAd(JSContext* cx, uint32_t argc, jsval* vp);
#endif
};

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
void CommonFunction_Notify_Splash_Fade();
#endif

#endif
