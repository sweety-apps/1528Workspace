//
//  js_CommonFunction.cpp
//  memeda
//
//  Created by 1528 on 13-10-4.
//
//

#include "js_CommonFunction.h"

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)

#include <jni.h>
#include "platform/android/jni/JniHelper.h"

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
        JS_FN("initAd", initAd, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("presentAd", presentAd, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setActualDefaultRingtoneUri", setActualDefaultRingtoneUri, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
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
    
    JniMethodInfo t;
    if ( !JniHelper::getStaticMethodInfo(t, "com/studio1528/qietingfengyun/CommonFunction", "openUrl", "(Ljava/lang/String;)V"))
    {
        CCLOG("JniHelper::getStaticMethodInfo Failed");
    }

	jstring url = t.env->NewStringUTF(strKey.c_str());
	t.env->CallStaticObjectMethod(t.classID, t.methodID, url);
	t.env->DeleteLocalRef(url);

    return JS_TRUE;
}

JSBool CommonFunction::setActualDefaultRingtoneUri(JSContext* cx, uint32_t argc, jsval* vp)
{
    jsval *argv = JS_ARGV(cx, vp);
    JSString* jsobj = JSVAL_TO_STRING(argv[0]);
    JSStringWrapper ring(jsobj);
    string strRing = ring.get().c_str();

    jsobj = JSVAL_TO_STRING(argv[1]);
    JSStringWrapper uri(jsobj);
    string strUri = uri.get().c_str();

    jsobj = JSVAL_TO_STRING(argv[2]);
    JSStringWrapper name(jsobj);
    string strName = name.get().c_str();

    JniMethodInfo t;
    if ( !JniHelper::getStaticMethodInfo(t, "com/studio1528/qietingfengyun/CommonFunction", "setActualDefaultRingtoneUri", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V"))
    {
        CCLOG("JniHelper::setActualDefaultRingtoneUri Failed");
    }

	jstring surl = t.env->NewStringUTF(strUri.c_str());
	jstring sring = t.env->NewStringUTF(strRing.c_str());
	jstring sname = t.env->NewStringUTF(strName.c_str());

	t.env->CallStaticObjectMethod(t.classID, t.methodID, sring, surl, sname);
	t.env->DeleteLocalRef(sring);
	t.env->DeleteLocalRef(surl);
	t.env->DeleteLocalRef(sname);

    CCLOG("setActualDefaultRingtoneUri");
    return JS_TRUE;
}

void CommonFunction_Notify_Splash_Fade()
{
    JniMethodInfo t;
    if ( !JniHelper::getStaticMethodInfo(t, "com/studio1528/qietingfengyun/CommonFunction", "removeSplashView", "()V"))
    {
        CCLOG("JniHelper::RemoveSplashView Failed");
    }
    
    t.env->CallStaticVoidMethod(t.classID, t.methodID);
    
    CCLOG("RemoveSplashView");
}

JSBool CommonFunction::initAd(JSContext* cx, uint32_t argc, jsval* vp)
{
    JniMethodInfo t;
    if ( !JniHelper::getStaticMethodInfo(t, "com/studio1528/qietingfengyun/CommonFunction", "initAd", "()V"))
    {
        CCLOG("initAd Failed");
    }

    t.env->CallStaticVoidMethod(t.classID, t.methodID);

    CCLOG("initAd");

	return JS_TRUE;
}

JSBool CommonFunction::presentAd(JSContext* cx, uint32_t argc, jsval* vp)
{
    JniMethodInfo t;
    if ( !JniHelper::getStaticMethodInfo(t, "com/studio1528/qietingfengyun/CommonFunction", "presentAd", "()V"))
    {
        CCLOG("presentAd Failed");
    }

    t.env->CallStaticVoidMethod(t.classID, t.methodID);

    CCLOG("presentAd");

	return JS_TRUE;
}

#endif /*CC_TARGET_PLATFORM*/
