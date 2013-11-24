LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

LOCAL_MODULE := game_shared

LOCAL_MODULE_FILENAME := libgame

LOCAL_SRC_FILES := hellocpp/main.cpp \
                   ../../../../../memeda/memeda/Classes/AppDelegate.cpp \
                   ../../../../../memeda/memeda/Classes/js_CommonFunctionAndroid.cpp \
                   ../../../../../memeda/memeda/Classes/js_OfferWallController.cpp \
                   ../../../../../memeda/memeda/Classes/Stat.cpp \
                   ../../../../../memeda/memeda/Classes/Modules/OpenSocial/SocialShareAPI_js_bindings/jsb_SocialShareAPI.cpp \
                   ../../../../../memeda/memeda/Classes/Modules/OpenSocial/SocialShareAPI.cpp \
                   ../../../../../memeda/memeda/Classes/Modules/Payment/iOSIAP/iapAPI_js_bindings/jsb_iOSiapWrapper.cpp \
                   ../../../../../memeda/memeda/Classes/Modules/Payment/iOSIAP/iOSiapWrapper.cpp \
                   ../../../../../memeda/memeda/Classes/Game_Util_Functions_Android.cpp \
                   ../../../../../memeda/memeda/Classes/CPreloadHelper.cpp \
                   ../../../../../memeda/memeda/Classes/CPreloadHelperAndroidVar.cpp
                   
LOCAL_SRC_FILES += ../../../plugin/jsbindings/auto/jsb_pluginx_protocols_auto.cpp \
                   ../../../plugin/jsbindings/manual/pluginxUTF8.cpp \
                   ../../../plugin/jsbindings/manual/jsb_pluginx_basic_conversions.cpp \
                   ../../../plugin/jsbindings/manual/jsb_pluginx_manual_protocols.cpp \
                   ../../../plugin/jsbindings/manual/jsb_pluginx_manual_callback.cpp \
                   ../../../plugin/jsbindings/manual/jsb_pluginx_extension_registration.cpp \
                   ../../../plugin/jsbindings/manual/jsb_pluginx_spidermonkey_specifics.cpp 
                   

LOCAL_C_INCLUDES := $(LOCAL_PATH)/../../../../../memeda/memeda/Classes
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../../../../../memeda/memeda/Classes/Modules/OpenSocial
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../../../../../memeda/memeda/Classes/Modules/OpenSocial/SocialShareAPI_js_bindings
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../../../../../memeda/memeda/Classes/Modules/Payment/iOSIAP
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../../../../../memeda/memeda/Classes/Modules/Payment/iOSIAP/iapAPI_js_bindings
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../../../cocos2dx/textures
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../../../plugin/platform/android
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../../../plugin/protocols/include
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../../../plugin/jsbindings/manual


LOCAL_WHOLE_STATIC_LIBRARIES := cocos2dx_static
LOCAL_WHOLE_STATIC_LIBRARIES += PluginProtocolStatic
LOCAL_WHOLE_STATIC_LIBRARIES += cocosdenshion_static
LOCAL_WHOLE_STATIC_LIBRARIES += chipmunk_static
LOCAL_WHOLE_STATIC_LIBRARIES += spidermonkey_static
LOCAL_WHOLE_STATIC_LIBRARIES += scriptingcore-spidermonkey

#LOCAL_EXPORT_CFLAGS := -DCOCOS2D_DEBUG=2 -DCOCOS2D_JAVASCRIPT
LOCAL_EXPORT_CFLAGS := -DCOCOS2D_DEBUG=0 -DCOCOS2D_JAVASCRIPT

include $(BUILD_SHARED_LIBRARY)

$(call import-add-path,$(LOCAL_PATH)/../../..)
$(call import-add-path,$(LOCAL_PATH)/../../../cocos2dx/platform/third_party/android/prebuilt)
$(call import-add-path,$(LOCAL_PATH)/../../../plugin/protocols/platform/android)
$(call import-add-path,$(LOCAL_PATH)/../../../plugin/protocols/include)
$(call import-add-path,$(LOCAL_PATH)/../../../plugin)
$(call import-add-path,$(LOCAL_PATH)/../../../plugin/protocols/platform)
$(call import-add-path,$(LOCAL_PATH)/../../../plugin/protocols)
##$(call import-add-path,/Users/leejustin/Documents/SourceCode/GitHub/1528Workspace/SourceCode/Client/AndroidWorkSpace/cocos2d-x-2.1.4/scripting/javascript/bindings/js)

$(call import-module,cocos2dx)
$(call import-module,CocosDenshion/android)
$(call import-module,external/chipmunk)
$(call import-module,scripting/javascript/spidermonkey-android)
$(call import-module,scripting/javascript/bindings)
$(call import-module,protocols/android)