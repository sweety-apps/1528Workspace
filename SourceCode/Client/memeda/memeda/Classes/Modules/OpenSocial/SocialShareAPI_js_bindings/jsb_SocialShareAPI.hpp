#ifndef __jsb_SocialShareAPI_h__
#define __jsb_SocialShareAPI_h__

#include "jsapi.h"
#include "jsfriendapi.h"


extern JSClass  *jsb_WeChatShareCallBackClass_class;
extern JSObject *jsb_WeChatShareCallBackClass_prototype;

JSBool js_jsb_SocialShareAPI_WeChatShareCallBackClass_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_jsb_SocialShareAPI_WeChatShareCallBackClass_finalize(JSContext *cx, JSObject *obj);
void js_register_jsb_SocialShareAPI_WeChatShareCallBackClass(JSContext *cx, JSObject *global);
void register_all_jsb_SocialShareAPI(JSContext* cx, JSObject* obj);
JSBool js_jsb_SocialShareAPI_WeChatShareCallBackClass_onWechatShareCallback(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_SocialShareAPI_WeChatShareCallBackClass_WeChatShareCallBackClass(JSContext *cx, uint32_t argc, jsval *vp);

extern JSClass  *jsb_SocialShareAPI_class;
extern JSObject *jsb_SocialShareAPI_prototype;

JSBool js_jsb_SocialShareAPI_SocialShareAPI_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_jsb_SocialShareAPI_SocialShareAPI_finalize(JSContext *cx, JSObject *obj);
void js_register_jsb_SocialShareAPI_SocialShareAPI(JSContext *cx, JSObject *global);
void register_all_jsb_SocialShareAPI(JSContext* cx, JSObject* obj);
JSBool js_jsb_SocialShareAPI_SocialShareAPI_setShareButtonRectAtScreenForIPad(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_SocialShareAPI_SocialShareAPI_setWeChatShareCallbackTarget(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_SocialShareAPI_SocialShareAPI_initShareAPI(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_SocialShareAPI_SocialShareAPI_shareWeChatURL(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_SocialShareAPI_SocialShareAPI_iOS_application_openURL_sourceApplication_annotation(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_SocialShareAPI_SocialShareAPI_iOS_application_handleOpenURL(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_SocialShareAPI_SocialShareAPI_testShare(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_SocialShareAPI_SocialShareAPI_getWeChatShareCallbackTarget(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_SocialShareAPI_SocialShareAPI_uninitShareAPI(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_SocialShareAPI_SocialShareAPI_getInstance(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_SocialShareAPI_SocialShareAPI_SocialShareAPI(JSContext *cx, uint32_t argc, jsval *vp);
#endif

