//
//  Stat.cpp
//  memeda
//
//  Created by 1528 on 13-9-23.
//
//

#include "Stat.h"
#include "cocos2d_specifics.hpp"
#include "AppConfigVarDefines.h"

JSClass* CStatParam::jsb_StatParam_Class = 0;
JSObject* CStatParam::jsb_StatParam_prototype = 0;

void CStatParam::Finialize(JSFreeOp* fop, JSObject* obj)
{
}


void CStatParam::_js_register(JSContext *cx, JSObject *obj)
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
    
    jsb_StatParam_Class = (JSClass*)calloc(1, sizeof(JSClass));
    jsb_StatParam_Class->name = "StatParam";
    jsb_StatParam_Class->addProperty = JS_PropertyStub;
    jsb_StatParam_Class->delProperty = JS_PropertyStub;
    jsb_StatParam_Class->getProperty = JS_PropertyStub;
    jsb_StatParam_Class->setProperty = JS_StrictPropertyStub;
    jsb_StatParam_Class->enumerate = JS_EnumerateStub;
    jsb_StatParam_Class->resolve = JS_ResolveStub;
    jsb_StatParam_Class->convert = JS_ConvertStub;
    
    jsb_StatParam_Class->finalize = CStatParam::Finialize;
    jsb_StatParam_Class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);
    
    static JSPropertySpec properties[] = {
        {0, 0, 0, JSOP_NULLWRAPPER, JSOP_NULLWRAPPER}
    };
    
    static JSFunctionSpec funcs[] = {
        JS_FN("addKeyAndValue", js_addKeyAndValue, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    static JSFunctionSpec st_funcs[] = {
        JS_FS_END
    };
    
    jsb_StatParam_prototype = JS_InitClass(cx, obj, NULL, jsb_StatParam_Class, NULL, 0, properties, funcs, NULL, st_funcs);
    JSBool found;
    JS_SetPropertyAttributes(cx, obj, "StatParam", JSPROP_ENUMERATE | JSPROP_READONLY, &found);
    
    TypeTest<CStatParam> t;
    js_type_class_t* p;
    uint32_t typeId = t.s_id();
    HASH_FIND_INT(_js_global_type_ht, &typeId, p);
    if ( !p )
    {
        p = (js_type_class_t*)malloc(sizeof(js_type_class_t));
        p->type = typeId;
        p->jsclass = jsb_StatParam_Class;
        p->proto = jsb_StatParam_prototype;
        p->parentProto = NULL;
        HASH_ADD_INT(_js_global_type_ht, type, p);
    }
}

void CStatParam::addKeyAndValue(string strKey, string strValue)
{
    m_map[strKey] = strValue;
}

JSBool CStatParam::js_addKeyAndValue(JSContext* cx, uint32_t argc, jsval* vp)
{
    JSBool ok = JS_FALSE;
    JSObject* obj = NULL;
    CStatParam* pParam = NULL;
    obj = JS_THIS_OBJECT(cx, vp);
    js_proxy_t* proxy = jsb_get_js_proxy(obj);
    pParam = (CStatParam*)(proxy ? proxy->ptr : NULL);
    
    jsval *argv = JS_ARGV(cx, vp);
    JSString* jsobj = JSVAL_TO_STRING(argv[0]);
    JSStringWrapper pw(jsobj);
    string strKey = pw.get().c_str();
    
    
    JSString* jsobj2 = JSVAL_TO_STRING(argv[1]);
    JSStringWrapper pw2(jsobj2);
    string strValue = pw2.get().c_str();
    
    pParam->addKeyAndValue(strKey, strValue);
    
    ok = JS_TRUE;
    
    return ok;
}




CStat* CStat::g_Stat = 0;
JSClass* CStat::jsb_Stat_Class = 0;
JSObject* CStat::jsb_Stat_prototype = 0;

CStat* CStat::GetInstance()
{
    if ( g_Stat == 0 )
    {
        g_Stat = new CStat();
    }
    return g_Stat;
}

void   CStat::Init()
{
    cocos2d::plugin::PluginProtocol* plugin = cocos2d::plugin::PluginManager::getInstance()->loadPlugin("AnalyticsUmeng");
    m_analytics = dynamic_cast<cocos2d::plugin::ProtocolAnalytics*>(plugin);
    m_analytics->setDebugMode(false);
    m_analytics->setCaptureUncaughtException(true);
    m_analytics->startSession(kUmengAppId);
}

bool CStat::init()
{
    return true;
}

void CStat::Finialize(JSFreeOp* fop, JSObject* obj)
{
}

JSBool CStat::Constructor(JSContext* cx, uint32_t argc, jsval* vp)
{
    CStat* pStat = CStat::GetInstance();
    TypeTest<CStat> t;
    js_type_class_t* typeClass;
    uint32_t typeId = t.s_id();
    HASH_FIND_INT(_js_global_type_ht, &typeId, typeClass);
    assert(typeClass);
    JSObject* obj = JS_NewObject(cx, typeClass->jsclass, typeClass->proto, typeClass->parentProto);
    JS_SET_RVAL(cx, vp, OBJECT_TO_JSVAL(obj));
     
    js_proxy_t* p = jsb_new_proxy(pStat, obj);
    JS_AddNamedObjectRoot(cx, &p->obj, "memeda::Stat");
    return JS_TRUE;
}

void CStat::_js_register(JSContext *cx, JSObject *obj)
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
    
    jsb_Stat_Class = (JSClass*)calloc(1, sizeof(JSClass));
    jsb_Stat_Class->name = "Stat";
    jsb_Stat_Class->addProperty = JS_PropertyStub;
    jsb_Stat_Class->delProperty = JS_PropertyStub;
    jsb_Stat_Class->getProperty = JS_PropertyStub;
    jsb_Stat_Class->setProperty = JS_StrictPropertyStub;
    jsb_Stat_Class->enumerate = JS_EnumerateStub;
    jsb_Stat_Class->resolve = JS_ResolveStub;
    jsb_Stat_Class->convert = JS_ConvertStub;
    
    jsb_Stat_Class->finalize = CStat::Finialize;
    jsb_Stat_Class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);
    
    static JSPropertySpec properties[] = {
        {0, 0, 0, JSOP_NULLWRAPPER, JSOP_NULLWRAPPER}
    };
    
    static JSFunctionSpec funcs[] = {
        JS_FS_END
    };
    
    static JSFunctionSpec st_funcs[] = {
        JS_FN("logEvent", js_logEvent, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("createParam", js_createParam, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("logTimedEventEnd", js_logTimedEventEnd, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("logTimedEventBegin", js_logTimedEventBegin, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    jsb_Stat_prototype = JS_InitClass(cx, obj, NULL, jsb_Stat_Class, Constructor, 0, properties, funcs, NULL, st_funcs);
    JSBool found;
    JS_SetPropertyAttributes(cx, obj, "Stat", JSPROP_ENUMERATE | JSPROP_READONLY, &found);
    
    TypeTest<CStat> t;
    js_type_class_t* p;
    uint32_t typeId = t.s_id();
    HASH_FIND_INT(_js_global_type_ht, &typeId, p);
    if ( !p )
    {
        p = (js_type_class_t*)malloc(sizeof(js_type_class_t));
        p->type = typeId;
        p->jsclass = jsb_Stat_Class;
        p->proto = jsb_Stat_prototype;
        p->parentProto = NULL;
        HASH_ADD_INT(_js_global_type_ht, type, p);
    }
}

JSBool CStat::js_logTimedEventEnd(JSContext* cx, uint32_t argc, jsval* vp)
{
    jsval *argv = JS_ARGV(cx, vp);
    JSString* jsobj = JSVAL_TO_STRING(argv[0]);
    JSStringWrapper pw(jsobj);
    
    CStat::GetInstance()->logTimedEventEnd(pw.get());
    
    JS_SET_RVAL(cx, vp, JSVAL_VOID);
    return JS_TRUE;
}

JSBool CStat::js_logTimedEventBegin(JSContext* cx, uint32_t argc, jsval* vp)
{
    jsval *argv = JS_ARGV(cx, vp);
    JSString* jsobj = JSVAL_TO_STRING(argv[0]);
    JSStringWrapper pw(jsobj);
    
    CStat::GetInstance()->logTimedEventBegin(pw.get());
    
    JS_SET_RVAL(cx, vp, JSVAL_VOID);
    return JS_TRUE;
}



JSBool CStat::js_createParam(JSContext* cx, uint32_t argc, jsval* vp)
{
    CStatParam* pParam = CStatParam::create();
    js_proxy_t* proxy = js_get_or_create_proxy<CStatParam>(cx, pParam);
    jsval jsret = OBJECT_TO_JSVAL(proxy->obj);
    
    JS_SET_RVAL(cx, vp, jsret);
    
    return JS_TRUE;
}

JSBool CStat::js_logEvent(JSContext* cx, uint32_t argc, jsval* vp)
{
    JSBool ok = JS_FALSE;
    
    if ( argc == 2 )
    {
        jsval *argv = JS_ARGV(cx, vp);
        JSString* jsobj = JSVAL_TO_STRING(argv[0]);
        JSStringWrapper pw(jsobj);
        
        JSObject* pObj = JSVAL_TO_OBJECT(argv[1]);
        js_proxy_t* proxy = jsb_get_js_proxy(pObj);
        CStatParam* pParam = (CStatParam*)(proxy->ptr);
        
        CStat::GetInstance()->logEvent(pw.get(), pParam);
        
        ok = JS_TRUE;
        JS_SET_RVAL(cx, vp, JSVAL_VOID);
    }
    else if ( argc == 1 )
    {
        jsval *argv = JS_ARGV(cx, vp);
        JSString* jsobj = JSVAL_TO_STRING(argv[0]);
        JSStringWrapper pw(jsobj);
        
        CStat::GetInstance()->logEvent(pw.get());
        
        ok = JS_TRUE;
        JS_SET_RVAL(cx, vp, JSVAL_VOID);
    }
    
    return ok;
}

void CStat::logTimedEventBegin(string eventId)
{
    m_analytics->logTimedEventBegin(eventId.c_str());
}

void CStat::logTimedEventEnd(string eventId)
{
    m_analytics->logTimedEventEnd(eventId.c_str());
}

void CStat::logEvent(string strKey)
{
    m_analytics->logEvent(strKey.c_str());
}

void CStat::logEvent(string strKey, CStatParam* pParam)
{
    cocos2d::plugin::LogEventParamMap* ptr = pParam->getParamPtr();
    m_analytics->logEvent(strKey.c_str(), ptr);
}