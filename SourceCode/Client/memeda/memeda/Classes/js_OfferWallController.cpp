//
//  js_OfferWallController.cpp
//  memeda
//
//  Created by 1528 on 13-9-29.
//
//

#include "js_OfferWallController.h"
#include "AppConfigVarDefines.h"
#include "cocos2d_specifics.hpp"


bool js_OfferWallController::g_bInit = false;
cocos2d::plugin::ProtocolSocial* js_OfferWallController::g_ps = NULL;
JSClass* js_OfferWallController::jsb_Class = 0;
JSObject* js_OfferWallController::jsb_prototype = 0;
js_OfferWallController* js_OfferWallController::g_Instance = NULL;

bool js_OfferWallController::init()
{
    return true;
}

void js_OfferWallController::Finialize(JSFreeOp* fop, JSObject* obj)
{
}

JSBool js_OfferWallController::js_getInstance(JSContext* cx, uint32_t argc, jsval* vp)
{
    if ( g_Instance == NULL )
    {
        g_Instance = new js_OfferWallController();
    }
    
    js_proxy_t* proxy = js_get_or_create_proxy<js_OfferWallController>(cx, g_Instance);
    jsval jsret = OBJECT_TO_JSVAL(proxy->obj);
    
    JS_SET_RVAL(cx, vp, jsret);
    return JS_TRUE;
}

void js_OfferWallController::_js_register(JSContext *cx, JSObject *obj)
{
    jsval nsval;
    JSObject* ns;
    JS_GetProperty(cx, obj, "memeda", &nsval);
    if ( nsval == JSVAL_VOID )
    {
        ns = JS_NewObject(cx, NULL, NULL, NULL);
        nsval = OBJECT_TO_JSVAL(ns);
        JS_SetProperty(cx, obj, "memeda", &nsval);
    }
    else
    {
        JS_ValueToObject(cx, nsval, &ns);
    }
    
    obj = ns;
    
    jsb_Class = (JSClass*)calloc(1, sizeof(JSClass));
    jsb_Class->name = "OfferWallController";
    jsb_Class->addProperty = JS_PropertyStub;
    jsb_Class->delProperty = JS_PropertyStub;
    jsb_Class->getProperty = JS_PropertyStub;
    jsb_Class->setProperty = JS_StrictPropertyStub;
    jsb_Class->enumerate = JS_EnumerateStub;
    jsb_Class->resolve = JS_ResolveStub;
    jsb_Class->convert = JS_ConvertStub;
    
    jsb_Class->finalize = js_OfferWallController::Finialize;
    jsb_Class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);
    
    static JSPropertySpec properties[] = {
        {0, 0, 0, JSOP_NULLWRAPPER, JSOP_NULLWRAPPER}
    };
    
    static JSFunctionSpec funcs[] = {
        JS_FN("getInstance", js_getInstance, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("init", js_init, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("show", js_show, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("requestOnlineConsumeWithPoint", js_requestOnlineConsumeWithPoint, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("requestOnlinePointCheck", js_requestOnlinePointCheck, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    static JSFunctionSpec st_funcs[] = {
        JS_FS_END
    };
    
    jsb_prototype = JS_InitClass(cx, obj, NULL, jsb_Class, NULL, 0, properties, funcs, NULL, st_funcs);
    JSBool found;
    JS_SetPropertyAttributes(cx, obj, "OfferWallController", JSPROP_ENUMERATE | JSPROP_READONLY, &found);
    
    TypeTest<js_OfferWallController> t;
    js_type_class_t* p;
    uint32_t typeId = t.s_id();
    HASH_FIND_INT(_js_global_type_ht, &typeId, p);
    if ( !p )
    {
        p = (js_type_class_t*)malloc(sizeof(js_type_class_t));
        p->type = typeId;
        p->jsclass = jsb_Class;
        p->proto = jsb_prototype;
        p->parentProto = NULL;
        HASH_ADD_INT(_js_global_type_ht, type, p);
    }
}

JSBool js_OfferWallController::js_show(JSContext* cx, uint32_t argc, jsval* vp)
{
	CCLOG("ShowModal");
    g_ps->callFuncWithParam("ShowModal", NULL);
    CCLOG("ShowModal end");
    return JS_TRUE;
}

JSBool js_OfferWallController::js_requestOnlinePointCheck(JSContext* cx, uint32_t argc, jsval* vp)
{
    g_ps->callFuncWithParam("requestOnlinePointCheck", NULL);
    return JS_TRUE;
}

JSBool js_OfferWallController::js_requestOnlineConsumeWithPoint(JSContext* cx, uint32_t argc, jsval* vp)
{
    cocos2d::CCLog("requestOnlineConsumeWithPoint");
    jsval *argv = JS_ARGV(cx, vp);
    int32_t nValue = JSVAL_TO_INT(argv[0]);
    
    cocos2d::plugin::PluginParam value(nValue);
    
    CCLOG("requestOnlineConsumeWithPoint %d", nValue);
    g_ps->callFuncWithParam("requestOnlineConsumeWithPoint", &value, NULL);

    return JS_TRUE;
}


JSBool js_OfferWallController::js_init(JSContext* cx, uint32_t argc, jsval* vp)
{
    CCLOG("js_OfferWallController::js_init");
    if ( !g_bInit ) {
        CCLOG("js_OfferWallController::js_init 2");
        g_bInit = true;
        cocos2d::plugin::PluginProtocol* plugin = cocos2d::plugin::PluginManager::getInstance()->loadPlugin("AnalyticsOfferWall");
        if ( plugin == NULL )
        {
            CCLOG("js_OfferWallController::js_init 5");
        }

        g_ps = dynamic_cast<cocos2d::plugin::ProtocolSocial*>(plugin);
        if ( g_ps == NULL)
        {
            CCLOG("js_OfferWallController::js_init 4");
        }
        CCLOG("js_OfferWallController::js_init 3");
        
        jsval *argv = JS_ARGV(cx, vp);
        JSString* pObj = JSVAL_TO_STRING(argv[0]);
        JSStringWrapper jsUserID(pObj);
        
        cocos2d::plugin::PluginParam id(kOfferWallPubID);
        cocos2d::plugin::PluginParam userID(jsUserID.get().c_str());
        
        CCLOG("%s", (jsUserID.get().c_str()));

        g_ps->callFuncWithParam("SetUserID", &userID, NULL);
        g_ps->callFuncWithParam("Init", &id, NULL);
        
        OfferWallResultListener* list = new OfferWallResultListener();
        g_ps->setResultListener(list);
    }
    return JS_TRUE;
}

void OfferWallResultListener::onShareResult(cocos2d::plugin::ShareResultCode ret, const char* msg)
{
    if ( strcmp(msg, "WindowClosed") == 0 )
    {
        js_proxy_t* p = jsb_get_native_proxy(js_OfferWallController::g_Instance);
        
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(p->obj), "windowClosed");
    }
    else if ( strstr(msg, "offerWallDidFinishCheck") != NULL )
    {   // 查询获取到的金币结束
        js_proxy_t* p = jsb_get_native_proxy(js_OfferWallController::g_Instance);
        jsval retval;
        JSContext* jc = ScriptingCore::getInstance()->getGlobalContext();
        
        jsval v[] = {
            v[0] = c_string_to_jsval(jc, msg + strlen("offerWallDidFinishCheck "))
        };
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(p->obj), "offerWallDidFinishCheck", 1, v, &retval);
    }
    else if ( strstr(msg, "offerWallDidFinishConsume") != NULL)
    {
        js_proxy_t* p = jsb_get_native_proxy(js_OfferWallController::g_Instance);
        jsval retval;
        JSContext* jc = ScriptingCore::getInstance()->getGlobalContext();
        jsval v[] = {
            v[0] = c_string_to_jsval(jc, msg + strlen("offerWallDidFinishConsume "))
        };
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(p->obj), "offerWallDidFinishConsume", 1, v, &retval);
    }
    else if ( strcmp(msg, "offerWallDidFailCheck") == 0 )
    {
        js_proxy_t* p = jsb_get_native_proxy(js_OfferWallController::g_Instance);
        
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(p->obj), "offerWallDidFailCheck");
    }
    else if ( strcmp(msg, "offerWallDidFailConsume") == 0 )
    {
        js_proxy_t* p = jsb_get_native_proxy(js_OfferWallController::g_Instance);
        
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(p->obj), "offerWallDidFailConsume");
    }
    else if ( strcmp(msg, "requestOnlineConsumeWithPoint") == 0) {
        js_proxy_t* p = jsb_get_native_proxy(js_OfferWallController::g_Instance);
        jsval retval;
        JSContext* jc = ScriptingCore::getInstance()->getGlobalContext();

        jsval v[] = {
            v[0] = c_string_to_jsval(jc, msg + strlen("requestOnlineConsumeWithPoint "))
        };
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(p->obj), "requestOnlineConsumeWithPoint", 1, v, &retval);
    }
}
