#include "jsb_SocialShareAPI.hpp"
#include "cocos2d_specifics.hpp"
#include "SocialShareAPI.h"

template<class T>
static JSBool dummy_constructor(JSContext *cx, uint32_t argc, jsval *vp) {
	TypeTest<T> t;
	T* cobj = new T();
	js_type_class_t *p;
	uint32_t typeId = t.s_id();
	HASH_FIND_INT(_js_global_type_ht, &typeId, p);
	assert(p);
	JSObject *_tmp = JS_NewObject(cx, p->jsclass, p->proto, p->parentProto);
	js_proxy_t *pp = jsb_new_proxy(cobj, _tmp);
	JS_SET_RVAL(cx, vp, OBJECT_TO_JSVAL(_tmp));

	return JS_TRUE;
}

static JSBool empty_constructor(JSContext *cx, uint32_t argc, jsval *vp) {
	return JS_FALSE;
}


JSClass  *jsb_WeChatShareCallBackClass_class;
JSObject *jsb_WeChatShareCallBackClass_prototype;

JSBool js_jsb_SocialShareAPI_WeChatShareCallBackClass_onWechatShareCallback(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	WeChatShareCallBackClass* cobj = (WeChatShareCallBackClass *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "js_jsb_SocialShareAPI_WeChatShareCallBackClass_onWechatShareCallback : Invalid Native Object");
	if (argc == 2) {
		std::string arg0;
		std::string arg1;
		ok &= jsval_to_std_string(cx, argv[0], &arg0);
		ok &= jsval_to_std_string(cx, argv[1], &arg1);
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "js_jsb_SocialShareAPI_WeChatShareCallBackClass_onWechatShareCallback : Error processing arguments");
		cobj->onWechatShareCallback(arg0, arg1);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}

	JS_ReportError(cx, "js_jsb_SocialShareAPI_WeChatShareCallBackClass_onWechatShareCallback : wrong number of arguments: %d, was expecting %d", argc, 2);
	return JS_FALSE;
}
JSBool js_jsb_SocialShareAPI_WeChatShareCallBackClass_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		WeChatShareCallBackClass* cobj = new WeChatShareCallBackClass();
		TypeTest<WeChatShareCallBackClass> t;
		js_type_class_t *typeClass;
		uint32_t typeId = t.s_id();
		HASH_FIND_INT(_js_global_type_ht, &typeId, typeClass);
		assert(typeClass);
		JSObject *obj = JS_NewObject(cx, typeClass->jsclass, typeClass->proto, typeClass->parentProto);
		JS_SET_RVAL(cx, vp, OBJECT_TO_JSVAL(obj));
		// link the native object with the javascript object
		js_proxy_t* p = jsb_new_proxy(cobj, obj);
		return JS_TRUE;
	}

	JS_ReportError(cx, "js_jsb_SocialShareAPI_WeChatShareCallBackClass_constructor : wrong number of arguments: %d, was expecting %d", argc, 0);
	return JS_FALSE;
}




void js_jsb_SocialShareAPI_WeChatShareCallBackClass_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (WeChatShareCallBackClass)", obj);
    js_proxy_t* nproxy;
    js_proxy_t* jsproxy;
    jsproxy = jsb_get_js_proxy(obj);
    if (jsproxy) {
        nproxy = jsb_get_native_proxy(jsproxy->ptr);

        WeChatShareCallBackClass *nobj = static_cast<WeChatShareCallBackClass *>(nproxy->ptr);
        if (nobj)
            delete nobj;
        
        jsb_remove_proxy(nproxy, jsproxy);
    }
}

static JSBool js_jsb_SocialShareAPI_WeChatShareCallBackClass_ctor(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
    WeChatShareCallBackClass *nobj = new WeChatShareCallBackClass();
    js_proxy_t* p = jsb_new_proxy(nobj, obj);
    JS_SET_RVAL(cx, vp, JSVAL_VOID);
    return JS_TRUE;
}

void js_register_jsb_SocialShareAPI_WeChatShareCallBackClass(JSContext *cx, JSObject *global) {
	jsb_WeChatShareCallBackClass_class = (JSClass *)calloc(1, sizeof(JSClass));
	jsb_WeChatShareCallBackClass_class->name = "WeChatShareCallBackClass";
	jsb_WeChatShareCallBackClass_class->addProperty = JS_PropertyStub;
	jsb_WeChatShareCallBackClass_class->delProperty = JS_PropertyStub;
	jsb_WeChatShareCallBackClass_class->getProperty = JS_PropertyStub;
	jsb_WeChatShareCallBackClass_class->setProperty = JS_StrictPropertyStub;
	jsb_WeChatShareCallBackClass_class->enumerate = JS_EnumerateStub;
	jsb_WeChatShareCallBackClass_class->resolve = JS_ResolveStub;
	jsb_WeChatShareCallBackClass_class->convert = JS_ConvertStub;
	jsb_WeChatShareCallBackClass_class->finalize = js_jsb_SocialShareAPI_WeChatShareCallBackClass_finalize;
	jsb_WeChatShareCallBackClass_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

	JSPropertySpec *properties = NULL;

	static JSFunctionSpec funcs[] = {
		JS_FN("onWechatShareCallback", js_jsb_SocialShareAPI_WeChatShareCallBackClass_onWechatShareCallback, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ctor", js_jsb_SocialShareAPI_WeChatShareCallBackClass_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
	};

	JSFunctionSpec *st_funcs = NULL;

	jsb_WeChatShareCallBackClass_prototype = JS_InitClass(
		cx, global,
		NULL, // parent proto
		jsb_WeChatShareCallBackClass_class,
		js_jsb_SocialShareAPI_WeChatShareCallBackClass_constructor, 0, // constructor
		properties,
		funcs,
		NULL, // no static properties
		st_funcs);
	// make the class enumerable in the registered namespace
	JSBool found;
	JS_SetPropertyAttributes(cx, global, "WeChatShareCallBackClass", JSPROP_ENUMERATE | JSPROP_READONLY, &found);

	// add the proto and JSClass to the type->js info hash table
	TypeTest<WeChatShareCallBackClass> t;
	js_type_class_t *p;
	uint32_t typeId = t.s_id();
	HASH_FIND_INT(_js_global_type_ht, &typeId, p);
	if (!p) {
		p = (js_type_class_t *)malloc(sizeof(js_type_class_t));
		p->type = typeId;
		p->jsclass = jsb_WeChatShareCallBackClass_class;
		p->proto = jsb_WeChatShareCallBackClass_prototype;
		p->parentProto = NULL;
		HASH_ADD_INT(_js_global_type_ht, type, p);
	}
}


JSClass  *jsb_SocialShareAPI_class;
JSObject *jsb_SocialShareAPI_prototype;

JSBool js_jsb_SocialShareAPI_SocialShareAPI_setWeChatShareCallbackTarget(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	SocialShareAPI* cobj = (SocialShareAPI *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "js_jsb_SocialShareAPI_SocialShareAPI_setWeChatShareCallbackTarget : Invalid Native Object");
	if (argc == 1) {
		WeChatShareCallBackClass* arg0;
		do {
			if (!argv[0].isObject()) { ok = JS_FALSE; break; }
			js_proxy_t *proxy;
			JSObject *tmpObj = JSVAL_TO_OBJECT(argv[0]);
			proxy = jsb_get_js_proxy(tmpObj);
			arg0 = (WeChatShareCallBackClass*)(proxy ? proxy->ptr : NULL);
			JSB_PRECONDITION2( arg0, cx, JS_FALSE, "Invalid Native Object");
		} while (0);
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "js_jsb_SocialShareAPI_SocialShareAPI_setWeChatShareCallbackTarget : Error processing arguments");
		cobj->setWeChatShareCallbackTarget(arg0);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}

	JS_ReportError(cx, "js_jsb_SocialShareAPI_SocialShareAPI_setWeChatShareCallbackTarget : wrong number of arguments: %d, was expecting %d", argc, 1);
	return JS_FALSE;
}
JSBool js_jsb_SocialShareAPI_SocialShareAPI_initShareAPI(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	SocialShareAPI* cobj = (SocialShareAPI *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "js_jsb_SocialShareAPI_SocialShareAPI_initShareAPI : Invalid Native Object");
	if (argc == 0) {
		cobj->initShareAPI();
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}

	JS_ReportError(cx, "js_jsb_SocialShareAPI_SocialShareAPI_initShareAPI : wrong number of arguments: %d, was expecting %d", argc, 0);
	return JS_FALSE;
}
JSBool js_jsb_SocialShareAPI_SocialShareAPI_shareWeChatURL(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	SocialShareAPI* cobj = (SocialShareAPI *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "js_jsb_SocialShareAPI_SocialShareAPI_shareWeChatURL : Invalid Native Object");
	if (argc == 6) {
		std::string arg0;
		std::string arg1;
		std::string arg2;
		std::string arg3;
		std::string arg4;
		JSBool arg5;
		ok &= jsval_to_std_string(cx, argv[0], &arg0);
		ok &= jsval_to_std_string(cx, argv[1], &arg1);
		ok &= jsval_to_std_string(cx, argv[2], &arg2);
		ok &= jsval_to_std_string(cx, argv[3], &arg3);
		ok &= jsval_to_std_string(cx, argv[4], &arg4);
		ok &= JS_ValueToBoolean(cx, argv[5], &arg5);
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "js_jsb_SocialShareAPI_SocialShareAPI_shareWeChatURL : Error processing arguments");
		cobj->shareWeChatURL(arg0, arg1, arg2, arg3, arg4, arg5);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}

	JS_ReportError(cx, "js_jsb_SocialShareAPI_SocialShareAPI_shareWeChatURL : wrong number of arguments: %d, was expecting %d", argc, 6);
	return JS_FALSE;
}
JSBool js_jsb_SocialShareAPI_SocialShareAPI_iOS_application_openURL_sourceApplication_annotation(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	SocialShareAPI* cobj = (SocialShareAPI *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "js_jsb_SocialShareAPI_SocialShareAPI_iOS_application_openURL_sourceApplication_annotation : Invalid Native Object");
	if (argc == 5) {
		void* arg0;
		void* arg1;
		void* arg2;
		void* arg3;
		void* arg4;
		#pragma warning NO CONVERSION TO NATIVE FOR void*;
		#pragma warning NO CONVERSION TO NATIVE FOR void*;
		#pragma warning NO CONVERSION TO NATIVE FOR void*;
		#pragma warning NO CONVERSION TO NATIVE FOR void*;
		#pragma warning NO CONVERSION TO NATIVE FOR void*;
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "js_jsb_SocialShareAPI_SocialShareAPI_iOS_application_openURL_sourceApplication_annotation : Error processing arguments");
		char ret = cobj->iOS_application_openURL_sourceApplication_annotation(arg0, arg1, arg2, arg3, arg4);
		jsval jsret;
		#pragma warning NO CONVERSION FROM NATIVE FOR char;
		JS_SET_RVAL(cx, vp, jsret);
		return JS_TRUE;
	}

	JS_ReportError(cx, "js_jsb_SocialShareAPI_SocialShareAPI_iOS_application_openURL_sourceApplication_annotation : wrong number of arguments: %d, was expecting %d", argc, 5);
	return JS_FALSE;
}
JSBool js_jsb_SocialShareAPI_SocialShareAPI_iOS_application_handleOpenURL(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	SocialShareAPI* cobj = (SocialShareAPI *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "js_jsb_SocialShareAPI_SocialShareAPI_iOS_application_handleOpenURL : Invalid Native Object");
	if (argc == 3) {
		void* arg0;
		void* arg1;
		void* arg2;
		#pragma warning NO CONVERSION TO NATIVE FOR void*;
		#pragma warning NO CONVERSION TO NATIVE FOR void*;
		#pragma warning NO CONVERSION TO NATIVE FOR void*;
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "js_jsb_SocialShareAPI_SocialShareAPI_iOS_application_handleOpenURL : Error processing arguments");
		char ret = cobj->iOS_application_handleOpenURL(arg0, arg1, arg2);
		jsval jsret;
		#pragma warning NO CONVERSION FROM NATIVE FOR char;
		JS_SET_RVAL(cx, vp, jsret);
		return JS_TRUE;
	}

	JS_ReportError(cx, "js_jsb_SocialShareAPI_SocialShareAPI_iOS_application_handleOpenURL : wrong number of arguments: %d, was expecting %d", argc, 3);
	return JS_FALSE;
}
JSBool js_jsb_SocialShareAPI_SocialShareAPI_testShare(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	SocialShareAPI* cobj = (SocialShareAPI *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "js_jsb_SocialShareAPI_SocialShareAPI_testShare : Invalid Native Object");
	if (argc == 0) {
		cobj->testShare();
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}

	JS_ReportError(cx, "js_jsb_SocialShareAPI_SocialShareAPI_testShare : wrong number of arguments: %d, was expecting %d", argc, 0);
	return JS_FALSE;
}
JSBool js_jsb_SocialShareAPI_SocialShareAPI_getWeChatShareCallbackTarget(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	SocialShareAPI* cobj = (SocialShareAPI *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "js_jsb_SocialShareAPI_SocialShareAPI_getWeChatShareCallbackTarget : Invalid Native Object");
	if (argc == 0) {
		WeChatShareCallBackClass* ret = cobj->getWeChatShareCallbackTarget();
		jsval jsret;
		do {
			if (ret) {
				js_proxy_t *proxy = js_get_or_create_proxy<WeChatShareCallBackClass>(cx, ret);
				jsret = OBJECT_TO_JSVAL(proxy->obj);
			} else {
				jsret = JSVAL_NULL;
			}
		} while (0);
		JS_SET_RVAL(cx, vp, jsret);
		return JS_TRUE;
	}

	JS_ReportError(cx, "js_jsb_SocialShareAPI_SocialShareAPI_getWeChatShareCallbackTarget : wrong number of arguments: %d, was expecting %d", argc, 0);
	return JS_FALSE;
}
JSBool js_jsb_SocialShareAPI_SocialShareAPI_uninitShareAPI(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	SocialShareAPI* cobj = (SocialShareAPI *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "js_jsb_SocialShareAPI_SocialShareAPI_uninitShareAPI : Invalid Native Object");
	if (argc == 0) {
		cobj->uninitShareAPI();
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}

	JS_ReportError(cx, "js_jsb_SocialShareAPI_SocialShareAPI_uninitShareAPI : wrong number of arguments: %d, was expecting %d", argc, 0);
	return JS_FALSE;
}
JSBool js_jsb_SocialShareAPI_SocialShareAPI_getInstance(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		SocialShareAPI* ret = SocialShareAPI::getInstance();
		jsval jsret;
		do {
		if (ret) {
			js_proxy_t *proxy = js_get_or_create_proxy<SocialShareAPI>(cx, ret);
			jsret = OBJECT_TO_JSVAL(proxy->obj);
		} else {
			jsret = JSVAL_NULL;
		}
	} while (0);
		JS_SET_RVAL(cx, vp, jsret);
		return JS_TRUE;
	}
	JS_ReportError(cx, "js_jsb_SocialShareAPI_SocialShareAPI_getInstance : wrong number of arguments");
	return JS_FALSE;
}

JSBool js_jsb_SocialShareAPI_SocialShareAPI_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		SocialShareAPI* cobj = new SocialShareAPI();
		TypeTest<SocialShareAPI> t;
		js_type_class_t *typeClass;
		uint32_t typeId = t.s_id();
		HASH_FIND_INT(_js_global_type_ht, &typeId, typeClass);
		assert(typeClass);
		JSObject *obj = JS_NewObject(cx, typeClass->jsclass, typeClass->proto, typeClass->parentProto);
		JS_SET_RVAL(cx, vp, OBJECT_TO_JSVAL(obj));
		// link the native object with the javascript object
		js_proxy_t* p = jsb_new_proxy(cobj, obj);
		return JS_TRUE;
	}

	JS_ReportError(cx, "js_jsb_SocialShareAPI_SocialShareAPI_constructor : wrong number of arguments: %d, was expecting %d", argc, 0);
	return JS_FALSE;
}




void js_jsb_SocialShareAPI_SocialShareAPI_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (SocialShareAPI)", obj);
    js_proxy_t* nproxy;
    js_proxy_t* jsproxy;
    jsproxy = jsb_get_js_proxy(obj);
    if (jsproxy) {
        nproxy = jsb_get_native_proxy(jsproxy->ptr);

        SocialShareAPI *nobj = static_cast<SocialShareAPI *>(nproxy->ptr);
        if (nobj)
            delete nobj;
        
        jsb_remove_proxy(nproxy, jsproxy);
    }
}

static JSBool js_jsb_SocialShareAPI_SocialShareAPI_ctor(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
    SocialShareAPI *nobj = new SocialShareAPI();
    js_proxy_t* p = jsb_new_proxy(nobj, obj);
    JS_SET_RVAL(cx, vp, JSVAL_VOID);
    return JS_TRUE;
}

void js_register_jsb_SocialShareAPI_SocialShareAPI(JSContext *cx, JSObject *global) {
	jsb_SocialShareAPI_class = (JSClass *)calloc(1, sizeof(JSClass));
	jsb_SocialShareAPI_class->name = "SocialShareAPI";
	jsb_SocialShareAPI_class->addProperty = JS_PropertyStub;
	jsb_SocialShareAPI_class->delProperty = JS_PropertyStub;
	jsb_SocialShareAPI_class->getProperty = JS_PropertyStub;
	jsb_SocialShareAPI_class->setProperty = JS_StrictPropertyStub;
	jsb_SocialShareAPI_class->enumerate = JS_EnumerateStub;
	jsb_SocialShareAPI_class->resolve = JS_ResolveStub;
	jsb_SocialShareAPI_class->convert = JS_ConvertStub;
	jsb_SocialShareAPI_class->finalize = js_jsb_SocialShareAPI_SocialShareAPI_finalize;
	jsb_SocialShareAPI_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

	static JSPropertySpec properties[] = {
		{0, 0, 0, JSOP_NULLWRAPPER, JSOP_NULLWRAPPER}
	};

	static JSFunctionSpec funcs[] = {
		JS_FN("setWeChatShareCallbackTarget", js_jsb_SocialShareAPI_SocialShareAPI_setWeChatShareCallbackTarget, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("initShareAPI", js_jsb_SocialShareAPI_SocialShareAPI_initShareAPI, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("shareWeChatURL", js_jsb_SocialShareAPI_SocialShareAPI_shareWeChatURL, 6, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("iOS_application_openURL_sourceApplication_annotation", js_jsb_SocialShareAPI_SocialShareAPI_iOS_application_openURL_sourceApplication_annotation, 5, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("iOS_application_handleOpenURL", js_jsb_SocialShareAPI_SocialShareAPI_iOS_application_handleOpenURL, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("testShare", js_jsb_SocialShareAPI_SocialShareAPI_testShare, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("getWeChatShareCallbackTarget", js_jsb_SocialShareAPI_SocialShareAPI_getWeChatShareCallbackTarget, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("uninitShareAPI", js_jsb_SocialShareAPI_SocialShareAPI_uninitShareAPI, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ctor", js_jsb_SocialShareAPI_SocialShareAPI_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
	};

	static JSFunctionSpec st_funcs[] = {
		JS_FN("getInstance", js_jsb_SocialShareAPI_SocialShareAPI_getInstance, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FS_END
	};

	jsb_SocialShareAPI_prototype = JS_InitClass(
		cx, global,
		NULL, // parent proto
		jsb_SocialShareAPI_class,
		js_jsb_SocialShareAPI_SocialShareAPI_constructor, 0, // constructor
		properties,
		funcs,
		NULL, // no static properties
		st_funcs);
	// make the class enumerable in the registered namespace
	JSBool found;
	JS_SetPropertyAttributes(cx, global, "SocialShareAPI", JSPROP_ENUMERATE | JSPROP_READONLY, &found);

	// add the proto and JSClass to the type->js info hash table
	TypeTest<SocialShareAPI> t;
	js_type_class_t *p;
	uint32_t typeId = t.s_id();
	HASH_FIND_INT(_js_global_type_ht, &typeId, p);
	if (!p) {
		p = (js_type_class_t *)malloc(sizeof(js_type_class_t));
		p->type = typeId;
		p->jsclass = jsb_SocialShareAPI_class;
		p->proto = jsb_SocialShareAPI_prototype;
		p->parentProto = NULL;
		HASH_ADD_INT(_js_global_type_ht, type, p);
	}
}

void register_all_jsb_SocialShareAPI(JSContext* cx, JSObject* obj) {
	// first, try to get the ns
	jsval nsval;
	JSObject *ns;
	JS_GetProperty(cx, obj, "cc", &nsval);
	if (nsval == JSVAL_VOID) {
		ns = JS_NewObject(cx, NULL, NULL, NULL);
		nsval = OBJECT_TO_JSVAL(ns);
		JS_SetProperty(cx, obj, "cc", &nsval);
	} else {
		JS_ValueToObject(cx, nsval, &ns);
	}
	obj = ns;

	js_register_jsb_SocialShareAPI_WeChatShareCallBackClass(cx, obj);
	js_register_jsb_SocialShareAPI_SocialShareAPI(cx, obj);
}

