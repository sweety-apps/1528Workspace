#ifndef __jsb_iOSiapWrapper_h__
#define __jsb_iOSiapWrapper_h__

#include "jsapi.h"
#include "jsfriendapi.h"


extern JSClass  *jsb_iOSiapWrapperCallBackClass_class;
extern JSObject *jsb_iOSiapWrapperCallBackClass_prototype;

JSBool js_jsb_iOSiapWrapper_iOSiapWrapperCallBackClass_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_jsb_iOSiapWrapper_iOSiapWrapperCallBackClass_finalize(JSContext *cx, JSObject *obj);
void js_register_jsb_iOSiapWrapper_iOSiapWrapperCallBackClass(JSContext *cx, JSObject *global);
void register_all_jsb_iOSiapWrapper(JSContext* cx, JSObject* obj);
JSBool js_jsb_iOSiapWrapper_iOSiapWrapperCallBackClass_onPurchaseCallback(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_iOSiapWrapper_iOSiapWrapperCallBackClass_iOSiapWrapperCallBackClass(JSContext *cx, uint32_t argc, jsval *vp);

extern JSClass  *jsb_iOSiapWrapper_class;
extern JSObject *jsb_iOSiapWrapper_prototype;

JSBool js_jsb_iOSiapWrapper_iOSiapWrapper_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_jsb_iOSiapWrapper_iOSiapWrapper_finalize(JSContext *cx, JSObject *obj);
void js_register_jsb_iOSiapWrapper_iOSiapWrapper(JSContext *cx, JSObject *global);
void register_all_jsb_iOSiapWrapper(JSContext* cx, JSObject* obj);
JSBool js_jsb_iOSiapWrapper_iOSiapWrapper_payForProduct(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_iOSiapWrapper_iOSiapWrapper_getPurchaseCallbackTarget(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_iOSiapWrapper_iOSiapWrapper_setPurchaseCallbackTarget(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_iOSiapWrapper_iOSiapWrapper_getInstance(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_iOSiapWrapper_iOSiapWrapper_iOSiapWrapper(JSContext *cx, uint32_t argc, jsval *vp);
#endif

