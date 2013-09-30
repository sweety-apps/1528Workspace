#include "jsb_iOSiapWrapper.hpp"
#include "cocos2d_specifics.hpp"
#include "iOSiapWrapper.h"

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


JSClass  *jsb_iOSiapWrapperCallBackClass_class;
JSObject *jsb_iOSiapWrapperCallBackClass_prototype;

JSBool js_jsb_iOSiapWrapper_iOSiapWrapperCallBackClass_onPurchaseCallback(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	iOSiapWrapperCallBackClass* cobj = (iOSiapWrapperCallBackClass *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "js_jsb_iOSiapWrapper_iOSiapWrapperCallBackClass_onPurchaseCallback : Invalid Native Object");
	if (argc == 3) {
		std::string arg0;
		std::string arg1;
		std::string arg2;
		ok &= jsval_to_std_string(cx, argv[0], &arg0);
		ok &= jsval_to_std_string(cx, argv[1], &arg1);
		ok &= jsval_to_std_string(cx, argv[2], &arg2);
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "js_jsb_iOSiapWrapper_iOSiapWrapperCallBackClass_onPurchaseCallback : Error processing arguments");
		cobj->onPurchaseCallback(arg0, arg1, arg2);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}

	JS_ReportError(cx, "js_jsb_iOSiapWrapper_iOSiapWrapperCallBackClass_onPurchaseCallback : wrong number of arguments: %d, was expecting %d", argc, 3);
	return JS_FALSE;
}
JSBool js_jsb_iOSiapWrapper_iOSiapWrapperCallBackClass_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		iOSiapWrapperCallBackClass* cobj = new iOSiapWrapperCallBackClass();
		TypeTest<iOSiapWrapperCallBackClass> t;
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

	JS_ReportError(cx, "js_jsb_iOSiapWrapper_iOSiapWrapperCallBackClass_constructor : wrong number of arguments: %d, was expecting %d", argc, 0);
	return JS_FALSE;
}




void js_jsb_iOSiapWrapper_iOSiapWrapperCallBackClass_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (iOSiapWrapperCallBackClass)", obj);
    js_proxy_t* nproxy;
    js_proxy_t* jsproxy;
    jsproxy = jsb_get_js_proxy(obj);
    if (jsproxy) {
        nproxy = jsb_get_native_proxy(jsproxy->ptr);

        iOSiapWrapperCallBackClass *nobj = static_cast<iOSiapWrapperCallBackClass *>(nproxy->ptr);
        if (nobj)
            delete nobj;
        
        jsb_remove_proxy(nproxy, jsproxy);
    }
}

static JSBool js_jsb_iOSiapWrapper_iOSiapWrapperCallBackClass_ctor(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
    iOSiapWrapperCallBackClass *nobj = new iOSiapWrapperCallBackClass();
    js_proxy_t* p = jsb_new_proxy(nobj, obj);
    JS_SET_RVAL(cx, vp, JSVAL_VOID);
    return JS_TRUE;
}

void js_register_jsb_iOSiapWrapper_iOSiapWrapperCallBackClass(JSContext *cx, JSObject *global) {
	jsb_iOSiapWrapperCallBackClass_class = (JSClass *)calloc(1, sizeof(JSClass));
	jsb_iOSiapWrapperCallBackClass_class->name = "iOSiapWrapperCallBackClass";
	jsb_iOSiapWrapperCallBackClass_class->addProperty = JS_PropertyStub;
	jsb_iOSiapWrapperCallBackClass_class->delProperty = JS_PropertyStub;
	jsb_iOSiapWrapperCallBackClass_class->getProperty = JS_PropertyStub;
	jsb_iOSiapWrapperCallBackClass_class->setProperty = JS_StrictPropertyStub;
	jsb_iOSiapWrapperCallBackClass_class->enumerate = JS_EnumerateStub;
	jsb_iOSiapWrapperCallBackClass_class->resolve = JS_ResolveStub;
	jsb_iOSiapWrapperCallBackClass_class->convert = JS_ConvertStub;
	jsb_iOSiapWrapperCallBackClass_class->finalize = js_jsb_iOSiapWrapper_iOSiapWrapperCallBackClass_finalize;
	jsb_iOSiapWrapperCallBackClass_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

	JSPropertySpec *properties = NULL;

	static JSFunctionSpec funcs[] = {
		JS_FN("onPurchaseCallback", js_jsb_iOSiapWrapper_iOSiapWrapperCallBackClass_onPurchaseCallback, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ctor", js_jsb_iOSiapWrapper_iOSiapWrapperCallBackClass_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
	};

	JSFunctionSpec *st_funcs = NULL;

	jsb_iOSiapWrapperCallBackClass_prototype = JS_InitClass(
		cx, global,
		NULL, // parent proto
		jsb_iOSiapWrapperCallBackClass_class,
		js_jsb_iOSiapWrapper_iOSiapWrapperCallBackClass_constructor, 0, // constructor
		properties,
		funcs,
		NULL, // no static properties
		st_funcs);
	// make the class enumerable in the registered namespace
	JSBool found;
	JS_SetPropertyAttributes(cx, global, "iOSiapWrapperCallBackClass", JSPROP_ENUMERATE | JSPROP_READONLY, &found);

	// add the proto and JSClass to the type->js info hash table
	TypeTest<iOSiapWrapperCallBackClass> t;
	js_type_class_t *p;
	uint32_t typeId = t.s_id();
	HASH_FIND_INT(_js_global_type_ht, &typeId, p);
	if (!p) {
		p = (js_type_class_t *)malloc(sizeof(js_type_class_t));
		p->type = typeId;
		p->jsclass = jsb_iOSiapWrapperCallBackClass_class;
		p->proto = jsb_iOSiapWrapperCallBackClass_prototype;
		p->parentProto = NULL;
		HASH_ADD_INT(_js_global_type_ht, type, p);
	}
}


JSClass  *jsb_iOSiapWrapper_class;
JSObject *jsb_iOSiapWrapper_prototype;

JSBool js_jsb_iOSiapWrapper_iOSiapWrapper_payForProduct(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	iOSiapWrapper* cobj = (iOSiapWrapper *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "js_jsb_iOSiapWrapper_iOSiapWrapper_payForProduct : Invalid Native Object");
	if (argc == 1) {
		std::string arg0;
		ok &= jsval_to_std_string(cx, argv[0], &arg0);
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "js_jsb_iOSiapWrapper_iOSiapWrapper_payForProduct : Error processing arguments");
		cobj->payForProduct(arg0);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}

	JS_ReportError(cx, "js_jsb_iOSiapWrapper_iOSiapWrapper_payForProduct : wrong number of arguments: %d, was expecting %d", argc, 1);
	return JS_FALSE;
}
JSBool js_jsb_iOSiapWrapper_iOSiapWrapper_getPurchaseCallbackTarget(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	iOSiapWrapper* cobj = (iOSiapWrapper *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "js_jsb_iOSiapWrapper_iOSiapWrapper_getPurchaseCallbackTarget : Invalid Native Object");
	if (argc == 0) {
		iOSiapWrapperCallBackClass* ret = cobj->getPurchaseCallbackTarget();
		jsval jsret;
		do {
			if (ret) {
				js_proxy_t *proxy = js_get_or_create_proxy<iOSiapWrapperCallBackClass>(cx, ret);
				jsret = OBJECT_TO_JSVAL(proxy->obj);
			} else {
				jsret = JSVAL_NULL;
			}
		} while (0);
		JS_SET_RVAL(cx, vp, jsret);
		return JS_TRUE;
	}

	JS_ReportError(cx, "js_jsb_iOSiapWrapper_iOSiapWrapper_getPurchaseCallbackTarget : wrong number of arguments: %d, was expecting %d", argc, 0);
	return JS_FALSE;
}
JSBool js_jsb_iOSiapWrapper_iOSiapWrapper_setPurchaseCallbackTarget(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	iOSiapWrapper* cobj = (iOSiapWrapper *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "js_jsb_iOSiapWrapper_iOSiapWrapper_setPurchaseCallbackTarget : Invalid Native Object");
	if (argc == 1) {
		iOSiapWrapperCallBackClass* arg0;
		do {
			if (!argv[0].isObject()) { ok = JS_FALSE; break; }
			js_proxy_t *proxy;
			JSObject *tmpObj = JSVAL_TO_OBJECT(argv[0]);
			proxy = jsb_get_js_proxy(tmpObj);
			arg0 = (iOSiapWrapperCallBackClass*)(proxy ? proxy->ptr : NULL);
			JSB_PRECONDITION2( arg0, cx, JS_FALSE, "Invalid Native Object");
		} while (0);
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "js_jsb_iOSiapWrapper_iOSiapWrapper_setPurchaseCallbackTarget : Error processing arguments");
		cobj->setPurchaseCallbackTarget(arg0);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}

	JS_ReportError(cx, "js_jsb_iOSiapWrapper_iOSiapWrapper_setPurchaseCallbackTarget : wrong number of arguments: %d, was expecting %d", argc, 1);
	return JS_FALSE;
}
JSBool js_jsb_iOSiapWrapper_iOSiapWrapper_getInstance(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		iOSiapWrapper* ret = iOSiapWrapper::getInstance();
		jsval jsret;
		do {
		if (ret) {
			js_proxy_t *proxy = js_get_or_create_proxy<iOSiapWrapper>(cx, ret);
			jsret = OBJECT_TO_JSVAL(proxy->obj);
		} else {
			jsret = JSVAL_NULL;
		}
	} while (0);
		JS_SET_RVAL(cx, vp, jsret);
		return JS_TRUE;
	}
	JS_ReportError(cx, "js_jsb_iOSiapWrapper_iOSiapWrapper_getInstance : wrong number of arguments");
	return JS_FALSE;
}

JSBool js_jsb_iOSiapWrapper_iOSiapWrapper_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		iOSiapWrapper* cobj = new iOSiapWrapper();
		TypeTest<iOSiapWrapper> t;
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

	JS_ReportError(cx, "js_jsb_iOSiapWrapper_iOSiapWrapper_constructor : wrong number of arguments: %d, was expecting %d", argc, 0);
	return JS_FALSE;
}




void js_jsb_iOSiapWrapper_iOSiapWrapper_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (iOSiapWrapper)", obj);
    js_proxy_t* nproxy;
    js_proxy_t* jsproxy;
    jsproxy = jsb_get_js_proxy(obj);
    if (jsproxy) {
        nproxy = jsb_get_native_proxy(jsproxy->ptr);

        iOSiapWrapper *nobj = static_cast<iOSiapWrapper *>(nproxy->ptr);
        if (nobj)
            delete nobj;
        
        jsb_remove_proxy(nproxy, jsproxy);
    }
}

static JSBool js_jsb_iOSiapWrapper_iOSiapWrapper_ctor(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
    iOSiapWrapper *nobj = new iOSiapWrapper();
    js_proxy_t* p = jsb_new_proxy(nobj, obj);
    JS_SET_RVAL(cx, vp, JSVAL_VOID);
    return JS_TRUE;
}

void js_register_jsb_iOSiapWrapper_iOSiapWrapper(JSContext *cx, JSObject *global) {
	jsb_iOSiapWrapper_class = (JSClass *)calloc(1, sizeof(JSClass));
	jsb_iOSiapWrapper_class->name = "iOSiapWrapper";
	jsb_iOSiapWrapper_class->addProperty = JS_PropertyStub;
	jsb_iOSiapWrapper_class->delProperty = JS_PropertyStub;
	jsb_iOSiapWrapper_class->getProperty = JS_PropertyStub;
	jsb_iOSiapWrapper_class->setProperty = JS_StrictPropertyStub;
	jsb_iOSiapWrapper_class->enumerate = JS_EnumerateStub;
	jsb_iOSiapWrapper_class->resolve = JS_ResolveStub;
	jsb_iOSiapWrapper_class->convert = JS_ConvertStub;
	jsb_iOSiapWrapper_class->finalize = js_jsb_iOSiapWrapper_iOSiapWrapper_finalize;
	jsb_iOSiapWrapper_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

	static JSPropertySpec properties[] = {
		{0, 0, 0, JSOP_NULLWRAPPER, JSOP_NULLWRAPPER}
	};

	static JSFunctionSpec funcs[] = {
		JS_FN("payForProduct", js_jsb_iOSiapWrapper_iOSiapWrapper_payForProduct, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("getPurchaseCallbackTarget", js_jsb_iOSiapWrapper_iOSiapWrapper_getPurchaseCallbackTarget, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("setPurchaseCallbackTarget", js_jsb_iOSiapWrapper_iOSiapWrapper_setPurchaseCallbackTarget, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ctor", js_jsb_iOSiapWrapper_iOSiapWrapper_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
	};

	static JSFunctionSpec st_funcs[] = {
		JS_FN("getInstance", js_jsb_iOSiapWrapper_iOSiapWrapper_getInstance, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FS_END
	};

	jsb_iOSiapWrapper_prototype = JS_InitClass(
		cx, global,
		NULL, // parent proto
		jsb_iOSiapWrapper_class,
		js_jsb_iOSiapWrapper_iOSiapWrapper_constructor, 0, // constructor
		properties,
		funcs,
		NULL, // no static properties
		st_funcs);
	// make the class enumerable in the registered namespace
	JSBool found;
	JS_SetPropertyAttributes(cx, global, "iOSiapWrapper", JSPROP_ENUMERATE | JSPROP_READONLY, &found);

	// add the proto and JSClass to the type->js info hash table
	TypeTest<iOSiapWrapper> t;
	js_type_class_t *p;
	uint32_t typeId = t.s_id();
	HASH_FIND_INT(_js_global_type_ht, &typeId, p);
	if (!p) {
		p = (js_type_class_t *)malloc(sizeof(js_type_class_t));
		p->type = typeId;
		p->jsclass = jsb_iOSiapWrapper_class;
		p->proto = jsb_iOSiapWrapper_prototype;
		p->parentProto = NULL;
		HASH_ADD_INT(_js_global_type_ht, type, p);
	}
}

void register_all_jsb_iOSiapWrapper(JSContext* cx, JSObject* obj) {
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

	js_register_jsb_iOSiapWrapper_iOSiapWrapperCallBackClass(cx, obj);
	js_register_jsb_iOSiapWrapper_iOSiapWrapper(cx, obj);
}

