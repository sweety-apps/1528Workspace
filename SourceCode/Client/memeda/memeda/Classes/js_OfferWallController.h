//
//  js_OfferWallController.h
//  memeda
//
//  Created by 1528 on 13-9-29.
//
//

#ifndef memeda_js_OfferWallController_h
#define memeda_js_OfferWallController_h

#include "js_bindings_config.h"
#include "ScriptingCore.h"
#include "jstypes.h"
#include "jsapi.h"
#include "jsfriendapi.h"
#include "jsb_helper.h"

#include "PluginProtocol.h"
#include "PluginManager.h"
#include "ProtocolAnalytics.h"
#include "ProtocolSocial.h"


class OfferWallResultListener : public cocos2d::plugin::ShareResultListener
{
    void onShareResult(cocos2d::plugin::ShareResultCode ret, const char* msg);
};

class js_OfferWallController : public cocos2d::CCObject
{
    friend class OfferWallResultListener;
public:
    static void _js_register(JSContext *cx, JSObject *global);
    
    virtual bool init();
    
    CREATE_FUNC(js_OfferWallController);
    
    static void Finialize(JSFreeOp* fop, JSObject* obj);
    
    static JSBool js_getInstance(JSContext* cx, uint32_t argc, jsval* vp);
    static JSBool js_show(JSContext* cx, uint32_t argc, jsval* vp);
    static JSBool js_init(JSContext* cx, uint32_t argc, jsval* vp);
    static JSBool js_requestOnlinePointCheck(JSContext* cx, uint32_t argc, jsval* vp);
    static JSBool js_requestOnlineConsumeWithPoint(JSContext* cx, uint32_t argc, jsval* vp);
    
private:
    static JSClass* jsb_Class;
    static JSObject* jsb_prototype;
    static bool    g_bInit;
    static cocos2d::plugin::ProtocolSocial* g_ps;
    static js_OfferWallController* g_Instance;
};


#endif
