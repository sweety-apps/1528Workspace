//
//  js_OfferWallController.cpp
//  memeda
//
//  Created by 1528 on 13-9-29.
//
//

#include "js_OfferWallController.h"
#include "AppConfigVarDefines.h"

bool js_OfferWallController::g_bInit = false;
cocos2d::plugin::ProtocolSocial* js_OfferWallController::g_ps = NULL;
JSClass* js_OfferWallController::jsb_Class = 0;
JSObject* js_OfferWallController::jsb_prototype = 0;

void js_OfferWallController::Finialize(JSFreeOp* fop, JSObject* obj)
{
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
        JS_FN("init", js_init, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("show", js_show, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    static JSFunctionSpec st_funcs[] = {
        JS_FN("init", js_init, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("show", js_show, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
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
    g_ps->callFuncWithParam("ShowModal", NULL);
    return JS_TRUE;
}

JSBool js_OfferWallController::js_init(JSContext* cx, uint32_t argc, jsval* vp)
{
    if ( !g_bInit ) {
        g_bInit = true;
        cocos2d::plugin::PluginProtocol* plugin = cocos2d::plugin::PluginManager::getInstance()->loadPlugin("AnalyticsOfferWall");
        g_ps = dynamic_cast<cocos2d::plugin::ProtocolSocial*>(plugin);
        cocos2d::plugin::PluginParam id(kOfferWallPubID);
        g_ps->callFuncWithParam("Init", &id, NULL);
    }
    return JS_TRUE;
}

/*
// test
cocos2d::plugin::PluginProtocol* plugin2 = cocos2d::plugin::PluginManager::getInstance()->loadPlugin("AnalyticsOfferWall");

cocos2d::plugin::ProtocolSocial* ps = dynamic_cast<cocos2d::plugin::ProtocolSocial*>(plugin2);
cocos2d::plugin::PluginParam id("96ZJ06UgzeimTwTAs3");
ps->callFuncWithParam("Init", &id, NULL);
ps->callFuncWithParam("ShowModal", NULL);

plugin2 = NULL;
*/
