//
//  Stat.h
//  memeda
//
//  Created by 1528 on 13-9-23.
//
//

#ifndef memeda_Stat_h
#define memeda_Stat_h

#include "js_bindings_config.h"
#include "ScriptingCore.h"
#include "jstypes.h"
#include "jsapi.h"
#include "jsfriendapi.h"
#include "jsb_helper.h"

#include "PluginProtocol.h"
#include "PluginManager.h"
#include "ProtocolAnalytics.h"

class CStatParam : public cocos2d::CCObject
{
public:
    CREATE_FUNC(CStatParam);
    virtual bool init() { return true; }
    
    static void _js_register(JSContext *cx, JSObject *global);
    
    static JSBool js_addKeyAndValue(JSContext* cx, uint32_t argc, jsval* vp);
    static void Finialize(JSFreeOp* fop, JSObject* obj);
    
    cocos2d::plugin::LogEventParamMap* getParamPtr()
    {
        return &m_map;
    }
private:
    void addKeyAndValue(string strKey, string strValue);
    
    static JSClass* jsb_StatParam_Class;
    static JSObject* jsb_StatParam_prototype;
    
    cocos2d::plugin::LogEventParamMap m_map;
};

class CStat : public cocos2d::CCObject
{
public:
    static CStat* GetInstance();
    void   Init();
    
    virtual bool init();
    
    CREATE_FUNC(CStat);
    
    static void _js_register(JSContext *cx, JSObject *global);
    
    static JSBool Constructor(JSContext* cx, uint32_t argc, jsval* vp);
    static void Finialize(JSFreeOp* fop, JSObject* obj);
    
    static JSBool js_logEvent(JSContext* cx, uint32_t argc, jsval* vp);
    static JSBool js_createParam(JSContext* cx, uint32_t argc, jsval* vp);
    
    static JSBool js_logTimedEventEnd(JSContext* cx, uint32_t argc, jsval* vp);
    static JSBool js_logTimedEventBegin(JSContext* cx, uint32_t argc, jsval* vp);
    
    void logTimedEventBegin(string eventId);
    void logTimedEventEnd(string eventId);
private:
    void logEvent(string strKey, CStatParam* pParam);
    void logEvent(string strKey);
    
    static CStat* g_Stat;
    
    static JSClass* jsb_Stat_Class;
    static JSObject* jsb_Stat_prototype;
    
    cocos2d::plugin::ProtocolAnalytics* m_analytics;
};

#endif
