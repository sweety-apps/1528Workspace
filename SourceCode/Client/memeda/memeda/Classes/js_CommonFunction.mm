//
//  js_CommonFunction.cpp
//  memeda
//
//  Created by 1528 on 13-10-4.
//
//

#include "js_CommonFunction.h"

#include <sys/types.h>
#include <sys/param.h>
#include <sys/ioctl.h>
#include <sys/socket.h>
#include <net/if.h>
#include <netinet/in.h>
#include <net/if_dl.h>
#include <sys/sysctl.h>
#include <Adsupport/AsIdentifierManager.h>
#include "RootViewController.h"

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
        JS_FN("getReportActiveURL", getReportActiveURL, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("presentAd", presentAd, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("initAd", initAd, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        
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

void GetMACAddress(unsigned char *mac)
{
    int                 mib[6];
    size_t              len;
    char                *buf;
    unsigned char       *ptr;
    struct if_msghdr    *ifm;
    struct sockaddr_dl  *sdl;
    
    mib[0] = CTL_NET;
    mib[1] = AF_ROUTE;
    mib[2] = 0;
    mib[3] = AF_LINK;
    mib[4] = NET_RT_IFLIST;
    
    if ((mib[5] = if_nametoindex("en0")) == 0) {
        printf("Error: if_nametoindex error/n");
        return ;
    }
    
    if (sysctl(mib, 6, NULL, &len, NULL, 0) < 0) {
        printf("Error: sysctl, take 1/n");
        return ;
    }
    
    if ((buf = (char*)malloc(len)) == NULL) {
        printf("Could not allocate memory. error!/n");
        return ;
    }
    
    if (sysctl(mib, 6, buf, &len, NULL, 0) < 0) {
        printf("Error: sysctl, take 2");
        free(buf);
        return ;
    }
    
    ifm = (struct if_msghdr *)buf;
    sdl = (struct sockaddr_dl *)(ifm + 1);
    ptr = (unsigned char *)LLADDR(sdl);
    memcpy(mac,ptr, 6);
    free(buf);
}


NSString * macaddress()
{
    int                    mib[6];
    size_t                len;
    char                *buf;
    unsigned char        *ptr;
    struct if_msghdr    *ifm;
    struct sockaddr_dl    *sdl;
    
    mib[0] = CTL_NET;
    mib[1] = AF_ROUTE;
    mib[2] = 0;
    mib[3] = AF_LINK;
    mib[4] = NET_RT_IFLIST;
    
    if ((mib[5] = if_nametoindex("en0")) == 0) {
        printf("Error: if_nametoindex error/n");
        return NULL;
    }
    
    if (sysctl(mib, 6, NULL, &len, NULL, 0) < 0) {
        printf("Error: sysctl, take 1/n");
        return NULL;
    }
    
    if ((buf = (char*)malloc(len)) == NULL) {
        printf("Could not allocate memory. error!/n");
        return NULL;
    }
    
    if (sysctl(mib, 6, buf, &len, NULL, 0) < 0) {
        printf("Error: sysctl, take 2");
        return NULL;
    }
    
    ifm = (struct if_msghdr *)buf;
    sdl = (struct sockaddr_dl *)(ifm + 1);
    ptr = (unsigned char *)LLADDR(sdl);

    NSString *outstring = [NSString stringWithFormat:@"%02x%02x%02x%02x%02x%02x", *ptr, *(ptr+1), *(ptr+2), *(ptr+3), *(ptr+4), *(ptr+5)];
    
    free(buf);
    
    return [outstring uppercaseString];
}

JSBool CommonFunction::getReportActiveURL(JSContext* cx, uint32_t argc, jsval* vp)
{
    float fVer = [[[UIDevice currentDevice] systemVersion] floatValue];
    char szUrl[1024] = {0};
    if ( fVer >= 6 )
    { // 获取IDFA
        NSString* adid = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
        const char* addr = [adid UTF8String];
        
        sprintf(szUrl, "http://www.meme-da.com/active/report.php?idfa=%s", addr);
    }
    else
    {
        // 获取mac
        NSString* macAddr = macaddress();
        const char* addr = [macAddr UTF8String];
    
        sprintf(szUrl, "http://www.meme-da.com/active/report.php?mac=%s", addr);
    }

    CCLOG("url : %s", szUrl);
    
    JSString* jsstr = JS_NewStringCopyZ(cx, szUrl);
    jsval jsret =  STRING_TO_JSVAL(jsstr);
    
    JS_SET_RVAL(cx, vp, jsret);
    
    return JS_TRUE;
}

JSBool CommonFunction::initAd(JSContext* cx, uint32_t argc, jsval* vp)
{
    [RootViewController initAd];
    return JS_TRUE;
}

JSBool CommonFunction::presentAd(JSContext* cx, uint32_t argc, jsval* vp)
{
    [RootViewController presentAd];
    return JS_TRUE;
}
