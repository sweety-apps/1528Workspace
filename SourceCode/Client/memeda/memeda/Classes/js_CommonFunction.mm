//
//  js_CommonFunction.cpp
//  memeda
//
//  Created by 1528 on 13-10-4.
//
//

#include "js_CommonFunction.h"

JSClass* CommonFunction::jsb_Class = 0;
JSObject* CommonFunction::jsb_prototype = 0;

void CommonFunction::Finialize(JSFreeOp* fop, JSObject* obj)
{
}

void CommonFunction::_js_register(JSContext *cx, JSObject *obj)
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
    jsb_Class->name = "common";
    jsb_Class->addProperty = JS_PropertyStub;
    jsb_Class->delProperty = JS_PropertyStub;
    jsb_Class->getProperty = JS_PropertyStub;
    jsb_Class->setProperty = JS_StrictPropertyStub;
    jsb_Class->enumerate = JS_EnumerateStub;
    jsb_Class->resolve = JS_ResolveStub;
    jsb_Class->convert = JS_ConvertStub;
    
    jsb_Class->finalize = CommonFunction::Finialize;
    jsb_Class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);
    
    static JSPropertySpec properties[] = {
        {0, 0, 0, JSOP_NULLWRAPPER, JSOP_NULLWRAPPER}
    };
    
    static JSFunctionSpec funcs[] = {
        JS_FN("openURL", openURL, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    static JSFunctionSpec st_funcs[] = {
        JS_FS_END
    };
    
    jsb_prototype = JS_InitClass(cx, obj, NULL, jsb_Class, NULL, 0, properties, funcs, NULL, st_funcs);
    JSBool found;
    JS_SetPropertyAttributes(cx, obj, "common", JSPROP_ENUMERATE | JSPROP_READONLY, &found);
    
    TypeTest<CommonFunction> t;
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

JSBool CommonFunction::openURL(JSContext* cx, uint32_t argc, jsval* vp)
{
    jsval *argv = JS_ARGV(cx, vp);
    JSString* jsobj = JSVAL_TO_STRING(argv[0]);
    JSStringWrapper pw(jsobj);
    string strKey = pw.get().c_str();

    NSString* url = [NSString stringWithUTF8String:strKey.c_str()];
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:url]];

    return JS_TRUE;
}